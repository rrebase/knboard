from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Avatar, User


class CustomUserAdmin(UserAdmin):
    list_display = (
        "username",
        "email",
        "first_name",
        "last_name",
        "is_staff",
        "is_guest",
    )
    list_filter = ("is_staff", "is_superuser", "is_active", "groups", "is_guest")


admin.site.register(Avatar)
admin.site.register(User, CustomUserAdmin)
