from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from boards.models import Board, Task, Column
from boards.serializers import BoardSerializer, TaskSerializer, BoardDetailSerializer


class BoardViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return BoardDetailSerializer
        return super().get_serializer_class()

    def get_queryset(self):
        if self.action == "retrieve":
            return super().get_queryset().prefetch_related("columns__tasks")
        return super().get_queryset()


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]


@api_view(["POST"])
def sort_column(request, format=None):
    print(request.POST)
    return sort_model(request, Column)


@api_view(["POST"])
def sort_task(request, format=None):
    return sort_model(request, Task)


def sort_model(request, Model):
    response = {"objects_sorted": False}

    try:
        ordered_pks = request.data.get("order", [])
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
