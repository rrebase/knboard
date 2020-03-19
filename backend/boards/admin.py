from django.contrib import admin
from adminsortable.admin import SortableAdmin

from .models import Board, Column, Task

admin.site.register(Board)
admin.site.register(Column, SortableAdmin)
admin.site.register(Task, SortableAdmin)
