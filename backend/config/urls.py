"""knboard URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from accounts.api import (
    UserViewSet,
    UserSearchView,
    AvatarViewSet,
    GuestRegistration,
    AuthSetup,
)
from boards.api import (
    BoardViewSet,
    ColumnViewSet,
    LabelViewSet,
    TaskViewSet,
    SortColumn,
    SortTask,
    CommentViewSet,
)

router = routers.DefaultRouter()
router.register(r"avatars", AvatarViewSet)
router.register(r"users", UserViewSet)
router.register(r"boards", BoardViewSet)
router.register(r"columns", ColumnViewSet)
router.register(r"labels", LabelViewSet)
router.register(r"tasks", TaskViewSet)
router.register(r"comments", CommentViewSet)

urlpatterns = [
    path("api/", include(router.urls)),
    path("api/u/search/", UserSearchView.as_view(), name="user-search"),
    path("api/sort/column/", SortColumn.as_view(), name="sort-column"),
    path("api/sort/task/", SortTask.as_view(), name="sort-task"),
    path("api-auth/", include("rest_framework.urls")),
    path("auth/", include("dj_rest_auth.urls")),
    path("auth/registration/", include("dj_rest_auth.registration.urls")),
    path("auth/setup/", AuthSetup.as_view(), name="auth-setup"),
    path("auth/guest/", GuestRegistration.as_view(), name="guest-registration"),
    path("backdoor/", admin.site.urls),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    try:
        import debug_toolbar

        urlpatterns = [path("__debug__/", include(debug_toolbar.urls))] + urlpatterns
    except ModuleNotFoundError:
        pass
