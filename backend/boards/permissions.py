from rest_framework import permissions


class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user


class IsOwnerForDangerousMethods(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to delete it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in ["POST", "PATCH", "DELETE"]:
            return obj.owner == request.user

        return request.method in permissions.SAFE_METHODS
