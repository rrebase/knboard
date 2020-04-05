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
from django.conf.urls import url
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from rest_framework import routers
from django.conf.urls.static import static


from accounts.api import UserViewSet, AvatarViewSet
from boards.api import BoardViewSet, ColumnViewSet, TaskViewSet, SortColumn, SortTask

router = routers.DefaultRouter()
router.register(r"avatars", AvatarViewSet)
router.register(r"users", UserViewSet)
router.register(r"boards", BoardViewSet)
router.register(r"columns", ColumnViewSet)
router.register(r"tasks", TaskViewSet)

urlpatterns = [
    url(r"^api/", include(router.urls)),
    url(r"^api/sort/column/", SortColumn.as_view(), name="sort-column"),
    url(r"^api/sort/task/", SortTask.as_view(), name="sort-task"),
    url(r"^api-auth/", include("rest_framework.urls")),
    url(r"^dj-rest-auth/", include("dj_rest_auth.urls")),
    url(r"^dj-rest-auth/registration/", include("dj_rest_auth.registration.urls")),
    path("tagauks/", admin.site.urls),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    import debug_toolbar

    urlpatterns = [path("__debug__/", include(debug_toolbar.urls))] + urlpatterns
