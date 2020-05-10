from django.contrib.auth import get_user_model
from rest_framework import serializers

from accounts.serializers import BoardMemberSerializer, BoardOwnerSerializer
from .models import Board, Task, Column, Label

User = get_user_model()


class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ["id", "name"]


class TaskSerializer(serializers.ModelSerializer):
    column = serializers.PrimaryKeyRelatedField(queryset=Column.objects.all())
    assignees = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), many=True, required=False
    )

    def create(self, validated_data):
        user = self.context["request"].user
        board_members = validated_data["column"].board.members.all()
        if user not in board_members:
            raise serializers.ValidationError("Must be a member of the board!")
        for assignee in validated_data["assignees"]:
            if assignee not in board_members:
                raise serializers.ValidationError(
                    "Can't assign someone who isn't a board member!"
                )
        return super().create(validated_data)

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "priority",
            "assignees",
            "task_order",
            "column",
        ]


class ColumnSerializer(serializers.ModelSerializer):
    board = serializers.PrimaryKeyRelatedField(queryset=Board.objects.all())
    tasks = TaskSerializer(many=True, read_only=True)

    def create(self, validated_data):
        if self.context["request"].user not in validated_data["board"].members.all():
            raise serializers.ValidationError("Must be a member of the board!")
        return super().create(validated_data)

    class Meta:
        model = Column
        fields = ["id", "title", "tasks", "column_order", "board"]


class LabelSerializer(serializers.ModelSerializer):
    board = serializers.PrimaryKeyRelatedField(queryset=Board.objects.all())

    def create(self, validated_data):
        if self.context["request"].user not in validated_data["board"].members.all():
            raise serializers.ValidationError("Must be a member of the board!")
        return super().create(validated_data)

    class Meta:
        model = Label
        fields = ["id", "name", "color", "board"]


class BoardDetailSerializer(serializers.ModelSerializer):
    columns = ColumnSerializer(many=True, read_only=True)
    owner = BoardOwnerSerializer(read_only=True)
    members = BoardMemberSerializer(many=True, read_only=True)
    labels = LabelSerializer(many=True, read_only=True)

    class Meta:
        model = Board
        fields = ["id", "name", "owner", "members", "columns", "labels"]


class MemberSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
