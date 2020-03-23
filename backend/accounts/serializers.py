from django.contrib.auth import get_user_model

from rest_framework import serializers
from dj_rest_auth.models import TokenModel

User = get_user_model()


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["id", "url", "username", "email"]


class BoardOwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id"]


class BoardMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]


class TokenSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = TokenModel
        fields = ("key", "username")
