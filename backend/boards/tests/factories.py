import factory
from django.contrib.auth import get_user_model
from boards.models import Board, Column, Task, Label, Comment
from factory.django import DjangoModelFactory

User = get_user_model()


class UserFactory(DjangoModelFactory):
    class Meta:
        model = User

    username = factory.Sequence(lambda n: f"jack{n}")
    email = factory.Sequence(lambda n: f"jack{n}@stargate.com")
    password = factory.Faker("password")


class BoardFactory(DjangoModelFactory):
    class Meta:
        model = Board

    name = factory.Sequence(lambda n: f"uni{n}")
    owner = factory.SubFactory(UserFactory)


class ColumnFactory(DjangoModelFactory):
    class Meta:
        model = Column

    board = factory.SubFactory(BoardFactory)
    title = factory.Sequence(lambda n: f"col{n}")


class TaskFactory(DjangoModelFactory):
    class Meta:
        model = Task

    title = factory.Sequence(lambda n: f"task{n}")
    description = factory.Sequence(lambda n: f"Some description{n}")
    column = factory.SubFactory(ColumnFactory)


class CommentFactory(DjangoModelFactory):
    class Meta:
        model = Comment

    task = factory.SubFactory(TaskFactory)
    author = factory.SubFactory(UserFactory)
    text = factory.Sequence(lambda n: f"Comment Text{n}")


class LabelFactory(DjangoModelFactory):
    class Meta:
        model = Label

    name = factory.Sequence(lambda n: f"label{n}")
    color = factory.Faker("hex_color")
    board = factory.SubFactory(BoardFactory)
