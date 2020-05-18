from django.conf import settings
from django.core import management
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Helpful command to run both makemigrations and migrate in one go"

    def handle(self, *args, **options):
        if not settings.DEBUG:
            raise CommandError("Command not meant for production")

        management.call_command("makemigrations")
        management.call_command("migrate")
