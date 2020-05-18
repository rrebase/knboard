from pathlib import Path

from dj_rest_auth.models import TokenModel
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import Avatar

User = get_user_model()


class AvatarSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = Avatar
        fields = ["id", "photo", "name"]

    def get_name(self, obj):
        return Path(obj.photo.name).stem


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]


class UserSearchSerializer(serializers.ModelSerializer):
    avatar = AvatarSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "avatar"]


class UserDetailSerializer(serializers.ModelSerializer):
    avatar = AvatarSerializer(read_only=True)
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all())], required=False
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "avatar",
            "date_joined",
            "is_guest",
        ]
        read_only_fields = [
            "id",
            "avatar",
            "date_joined",
        ]


class BoardOwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id"]


class BoardMemberSerializer(serializers.ModelSerializer):
    avatar = AvatarSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "avatar"]


class TokenSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="user.id", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = TokenModel
        # Include field "key" once frontend actually uses token auth
        # instead of the current session auth
        fields = ("id", "username", "photo_url")

    def get_photo_url(self, obj):
        if not obj.user.avatar:
            return None
        return obj.user.avatar.photo.url
