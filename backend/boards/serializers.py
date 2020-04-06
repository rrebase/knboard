from django.contrib.auth import get_user_model
from rest_framework import serializers

from accounts.serializers import BoardMemberSerializer, BoardOwnerSerializer
from .models import Board, Task, Column

User = get_user_model()


class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ["id", "name"]


class TaskSerializer(serializers.ModelSerializer):
    column = serializers.PrimaryKeyRelatedField(queryset=Column.objects.all())

    class Meta:
        model = Task
        fields = ["id", "title", "description", "task_order", "column"]


class ColumnSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = Column
        fields = ["id", "title", "tasks", "column_order"]


class BoardDetailSerializer(serializers.ModelSerializer):
    columns = ColumnSerializer(many=True, read_only=True)
    owner = BoardOwnerSerializer(read_only=True)
    members = BoardMemberSerializer(many=True, read_only=True)

    class Meta:
        model = Board
        fields = ["id", "name", "owner", "members", "columns"]


class MemberSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
