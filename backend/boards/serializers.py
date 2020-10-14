from django.contrib.auth import get_user_model
from django.db import IntegrityError
from rest_framework import serializers
from rest_framework.validators import ValidationError

from accounts.serializers import BoardMemberSerializer
from .models import Board, Task, Column, Label, Comment

User = get_user_model()


class BoardModelSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        if self.context["request"].user not in validated_data["board"].members.all():
            raise serializers.ValidationError("Must be a member of the board!")
        return super().create(validated_data)


class BoardSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Board
        fields = ["id", "name", "owner"]


class TaskSerializer(serializers.ModelSerializer):
    column = serializers.PrimaryKeyRelatedField(queryset=Column.objects.all())
    labels = serializers.PrimaryKeyRelatedField(
        queryset=Label.objects.all(), many=True, required=False
    )
    assignees = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), many=True, required=False
    )

    def extra_validation(self, board=None, labels=None, assignees=None, user=None):
        if labels and board:
            for label in labels:
                if label.board != board:
                    raise serializers.ValidationError(
                        "Can't set a label that doesn't belong to the board!"
                    )
        if assignees and board:
            for assignee in assignees:
                if assignee not in board.members.all():
                    raise serializers.ValidationError(
                        "Can't assign someone who isn't a board member!"
                    )
        if user and user not in board.members.all():
            raise serializers.ValidationError("Must be a member of the board!")

    def update(self, instance, validated_data):
        labels = validated_data.get("labels")
        assignees = validated_data.get("assignees")
        board = instance.column.board
        self.extra_validation(board=board, labels=labels, assignees=assignees)
        return super().update(instance, validated_data)

    def create(self, validated_data):
        user = self.context["request"].user
        board = validated_data["column"].board
        labels = validated_data["labels"]
        assignees = validated_data["assignees"]
        self.extra_validation(
            board=board, labels=labels, assignees=assignees, user=user
        )
        return super().create(validated_data)

    class Meta:
        model = Task
        fields = [
            "id",
            "created",
            "modified",
            "title",
            "description",
            "priority",
            "labels",
            "assignees",
            "task_order",
            "column",
        ]


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["id", "task", "author", "text", "created", "modified"]


class ColumnSerializer(BoardModelSerializer):
    board = serializers.PrimaryKeyRelatedField(queryset=Board.objects.all())
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = Column
        fields = ["id", "title", "tasks", "column_order", "board"]


class LabelSerializer(BoardModelSerializer):
    board = serializers.PrimaryKeyRelatedField(queryset=Board.objects.all())

    def update(self, instance, validated_data):
        try:
            return super().update(instance, validated_data)
        except IntegrityError:
            raise ValidationError("Label already exists")

    class Meta:
        model = Label
        fields = ["id", "name", "color", "board"]


class BoardDetailSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    columns = ColumnSerializer(many=True, read_only=True)
    members = BoardMemberSerializer(many=True, read_only=True)
    labels = LabelSerializer(many=True, read_only=True)

    class Meta:
        model = Board
        fields = ["id", "name", "owner", "members", "columns", "labels"]


class MemberSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
