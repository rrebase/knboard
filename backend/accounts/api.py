from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework import filters

from accounts.serializers import UserSerializer

User = get_user_model()


class UserViewSet(ReadOnlyModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['username']
