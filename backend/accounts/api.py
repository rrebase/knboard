import uuid

import shortuuid
from dj_rest_auth.registration.views import RegisterView
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import filters
from rest_framework import mixins
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet
from rest_framework.viewsets import ReadOnlyModelViewSet

from accounts.models import Avatar
from boards.demo import create_demo_board, get_random_avatar
from boards.models import Board
from .permissions import IsSelf
from .serializers import (
    AvatarSerializer,
    UserSerializer,
    UserDetailSerializer,
    UserSearchSerializer,
)

User = get_user_model()


class ExcludeBoardMembersFilter(filters.BaseFilterBackend):
    """
    Filter that only shows members that are not a member of board.
    """

    result_limit = 8
    filter_param = "board"

    def filter_queryset(self, request, queryset, view):
        board_id = request.query_params.get(self.filter_param)
        try:
            board = Board.objects.get(id=board_id)
        except (Board.DoesNotExist, ValueError):
            return queryset

        return queryset.exclude(id__in=board.members.all())[: self.result_limit]


class UserViewSet(
    mixins.RetrieveModelMixin, mixins.UpdateModelMixin, GenericViewSet,
):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated, IsSelf]

    def get_serializer_class(self):
        if self.action == "retrieve" or self.action == "update":
            return UserDetailSerializer
        return super().get_serializer_class()

    @action(detail=True, methods=["post"])
    def update_avatar(self, request, pk):
        avatar_id = request.data.get("id")
        avatar = Avatar.objects.get(id=avatar_id)
        user = self.get_object()
        user.avatar = avatar
        user.save()
        return Response(AvatarSerializer(instance=avatar).data)


class UserSearchView(ListAPIView):
    queryset = User.objects.filter(is_active=True).all()
    serializer_class = UserSearchSerializer
    filter_backends = [filters.SearchFilter, ExcludeBoardMembersFilter]
    permission_classes = [IsAuthenticated]
    search_fields = ["username"]

    def get(self, request, *args, **kwargs):
        """
        Don't want to make scraping users too easy.
        So there are some limits for this search endpoint.
        1) The search must have at least 3 characters
        2) A fixed low amount of users are returned at most
        """
        params = request.query_params
        board_id = params.get("board", "")
        search = params.get("search", "")
        if not board_id.isdigit() or not Board.objects.filter(id=board_id).exists():
            return Response(status=HTTP_400_BAD_REQUEST)
        if len(search) < 3:
            return Response([])

        return super().get(request, *args, **kwargs)


class AvatarViewSet(ReadOnlyModelViewSet):
    serializer_class = AvatarSerializer
    queryset = Avatar.objects.all()
    permission_classes = [IsAuthenticated]


class AuthSetup(APIView):
    def get(self, request, *args, **kwargs):
        return Response({"ALLOW_GUEST_ACCESS": settings.ALLOW_GUEST_ACCESS})


class GuestRegistration(RegisterView):
    def create(self, request, *args, **kwargs):
        if not settings.ALLOW_GUEST_ACCESS:
            raise PermissionDenied

        password = str(uuid.uuid4())
        guest_id = str(shortuuid.uuid())[:10]
        request.data.update(
            {
                "username": f"Guest-{guest_id}",
                "email": f"{guest_id}@guest.com",
                "password1": password,
                "password2": password,
            }
        )
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        user = super().perform_create(serializer)
        user.is_guest = True
        user.avatar = get_random_avatar()
        user.save()
        create_demo_board(user)
        return user
