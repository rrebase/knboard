from adminsortable.fields import SortableForeignKey
from adminsortable.models import SortableMixin
from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Board(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Column(SortableMixin):
    title = models.CharField(max_length=255)
    board = models.ForeignKey('Board', related_name='columns', on_delete=models.CASCADE)
    column_order = models.PositiveIntegerField(default=0, editable=False, db_index=True)

    class Meta:
        ordering = ['column_order']

    def __str__(self):
        return f'{self.title}'


class Task(SortableMixin):
    title = models.CharField(max_length=255)
    description = models.TextField()
    column = SortableForeignKey(Column, related_name="tasks", on_delete=models.CASCADE)
    task_order = models.PositiveIntegerField(default=0, editable=False, db_index=True)

    def __str__(self):
        return f'{self.id} - {self.title}'

    class Meta:
        ordering = ['task_order']
