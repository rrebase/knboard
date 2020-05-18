from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from accounts.models import User
from boards.models import Board
from boards.tests.factories import BoardFactory, ColumnFactory, TaskFactory, UserFactory


class Command(BaseCommand):
    help = "Load board with a lot of tasks for benchmarking"

    def add_arguments(self, parser):
        parser.add_argument("-f", "--force", required=False, type=bool)

    def handle(self, *args, **options):
        force = options["force"]

        if not settings.DEBUG:
            raise CommandError("Command not meant for production")

        if force:
            Board.objects.filter(name="Benchmark").delete()
        elif Board.objects.filter(name="Benchmark").exists():
            raise CommandError("Aborting. Benchmark already exists.")

        if User.objects.filter(username="steve").exists():
            user = User.objects.filter(username="steve").first()
        else:
            user = UserFactory(username="steve")

        board = BoardFactory(name="Benchmark", owner=user)
        for _ in range(10):
            column = ColumnFactory(board=board)
            for _ in range(50):
                TaskFactory(column=column)
