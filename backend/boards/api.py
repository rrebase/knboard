from django.db import transaction
from django.contrib.auth import get_user_model
from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework.response import Response
from rest_framework.serializers import Serializer
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_403_FORBIDDEN, HTTP_200_OK
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet
from rest_framework.decorators import action

from boards.models import Board, Task, Column
from boards.permissions import IsOwner, IsOwnerForDangerousMethods
from boards.serializers import BoardSerializer, TaskSerializer, BoardDetailSerializer, MemberSerializer, BoardMemberSerializer

User = get_user_model()


class BoardViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    GenericViewSet,
):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    permission_classes = [IsAuthenticated, IsOwnerForDangerousMethods]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_serializer_class(self):
        if self.action == "retrieve":
            return BoardDetailSerializer
        return super().get_serializer_class()

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset().filter(members=user)

        if self.action == "retrieve":
            return qs.prefetch_related("columns__tasks")
        return qs

    def get_member(self):
        try:
            member = User.objects.get(username=self.request.data.get('username'))
        except User.DoesNotExist:
            return Response(status=HTTP_400_BAD_REQUEST)

        return member

    @action(detail=True, methods=["post"], serializer_class=MemberSerializer, permission_classes=[IsOwner])
    def invite_member(self, request, pk):
        new_member = self.get_member()

        self.get_object().members.add(new_member)
        return Response(data=BoardMemberSerializer(instance=new_member).data)

    @action(detail=True, methods=["post"], serializer_class=MemberSerializer)
    def remove_member(self, request, pk):
        member = self.get_member()
        board = self.get_object()

        if member == board.owner:
            return Response(status=HTTP_400_BAD_REQUEST)

        board.members.remove(member)
        return Response(data=BoardMemberSerializer(instance=member).data)


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]


class SortColumnSerializer(Serializer):
    order = PrimaryKeyRelatedField(many=True, queryset=Column.objects.all())


class SortTaskSerializer(Serializer):
    order = PrimaryKeyRelatedField(many=True, queryset=Task.objects.all())


class SortColumn(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, format=None):
        serializer = SortColumnSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        response = sort_model(request, Column)
        return response


class SortTask(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, format=None):
        serializer = SortColumnSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        move_tasks(request)
        response = sort_model(request, Column)
        return response


def move_tasks(request):
    tasks_by_column = request.data.get("tasks")
    board_id = request.data.get("board")
    # board = Board.objects.get(id=board_id)

    for column_name, tasks in tasks_by_column.items():
        column = Column.objects.get(title=column_name)
        tasks = Task.objects.filter(pk__in=tasks)
        tasks.update(column=column)


def sort_model(request, Model):
    response = {"objects_sorted": False}

    try:
        ordered_pks = request.data.get("order", [])

        # Check for duplicates
        if len(ordered_pks) != len(set(ordered_pks)):
            return Response(status=HTTP_400_BAD_REQUEST)

        objects_dict = dict(
            [(str(obj.pk), obj) for obj in Model.objects.filter(pk__in=ordered_pks)]
        )

        order_field_name = Model._meta.ordering[0]

        if order_field_name.startswith("-"):
            order_field_name = order_field_name[1:]
            step = -1
            start_object = max(
                objects_dict.values(), key=lambda x: getattr(x, order_field_name)
            )
        else:
            step = 1
            start_object = min(
                objects_dict.values(), key=lambda x: getattr(x, order_field_name)
            )

        start_index = getattr(start_object, order_field_name, len(ordered_pks))

        for pk in ordered_pks:
            obj = objects_dict.get(str(pk))

            # perform the update only if the order field has changed
            if getattr(obj, order_field_name) != start_index:
                setattr(obj, order_field_name, start_index)
                # only update the object's order field
                obj.save(update_fields=[order_field_name])

            start_index += step
        response = {"objects_sorted": True}
    except (KeyError, IndexError, Model.DoesNotExist, AttributeError, ValueError) as e:
        pass

    return Response(response)
