from django.contrib import admin
from adminsortable.admin import SortableAdmin

from .models import Board, Label, Column, Task

admin.site.register(Label)
admin.site.register(Board)
admin.site.register(Column, SortableAdmin)
admin.site.register(Task, SortableAdmin)
