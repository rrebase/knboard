from rest_framework import permissions


class IsSelfForUpdate(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in ["PUT"]:
            return obj == request.user
        return request.method in permissions.SAFE_METHODS
