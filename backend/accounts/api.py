from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework import filters
from accounts.models import Avatar
from boards.models import Board
from rest_framework import mixins
from rest_framework.viewsets import GenericViewSet
from rest_framework.decorators import action
from rest_framework.response import Response

from .serializers import AvatarSerializer, UserSerializer, UserDetailSerializer
from .permissions import IsSelfForUpdate

User = get_user_model()


class ExcludeBoardMembersFilter(filters.BaseFilterBackend):
    """
    Filter that only shows members that are not a member of board.
    """

    filter_param = "excludemembers"

    def filter_queryset(self, request, queryset, view):
        board_id = request.query_params.get(self.filter_param)
        try:
            board = Board.objects.get(id=board_id)
        except Board.DoesNotExist:
            return queryset

        return queryset.exclude(id__in=board.members.all())


class UserViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    GenericViewSet,
):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated, IsSelfForUpdate]
    filter_backends = [filters.SearchFilter, ExcludeBoardMembersFilter]
    search_fields = ["username"]

    def get_serializer_class(self):
        if self.action == "retrieve" or self.action == "update":
            return UserDetailSerializer
        return super().get_serializer_class()

    @action(detail=True, methods=["post"])
    def update_avatar(self, request, pk):
        avatar_id = request.data.get('id')
        avatar = Avatar.objects.get(id=avatar_id)
        user = self.get_object()
        user.avatar = avatar
        user.save()
        return Response(AvatarSerializer(instance=avatar).data)


class AvatarViewSet(ReadOnlyModelViewSet):
    serializer_class = AvatarSerializer
    queryset = Avatar.objects.all()
    permission_classes = [IsAuthenticated]
