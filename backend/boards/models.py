from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Board(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Column(models.Model):
    title = models.CharField(max_length=255)
    board = models.ForeignKey('Board', related_name='columns', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.PROTECT)

    def __str__(self):
        return f'{self.title} {self.user.name}'


class Task(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(allow_unicode=True)
    description = models.TextField()
    weight = models.FloatField()
    column = models.ForeignKey('Column', related_name="tasks", on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.id} {self.title} {self.weight} {self.column.title}'

    class Meta:
        ordering = ['-weight']
