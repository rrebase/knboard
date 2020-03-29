import factory
from django.contrib.auth import get_user_model
from boards.models import Board, Column, Task

User = get_user_model()


class UserFactory(factory.DjangoModelFactory):
    class Meta:
        model = User

    username = factory.Sequence(lambda n: f"jack{n}")
    email = factory.Sequence(lambda n: f"jack{n}@stargate.com")
    password = factory.PostGenerationMethodCall("set_password", "jackpassword")


class BoardFactory(factory.DjangoModelFactory):
    class Meta:
        model = Board

    name = factory.Sequence(lambda n: f"uni{n}")
    owner = factory.SubFactory(UserFactory)


class ColumnFactory(factory.DjangoModelFactory):
    class Meta:
        model = Column

    board = factory.SubFactory(BoardFactory)
    title = factory.Sequence(lambda n: f"col{n}")


class TaskFactory(factory.DjangoModelFactory):
    class Meta:
        model = Task

    title = factory.Sequence(lambda n: f"task{n}")
    description = factory.Sequence(lambda n: f"Some description{n}")
    column = factory.SubFactory(ColumnFactory)
