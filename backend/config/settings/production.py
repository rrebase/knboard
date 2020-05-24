import os
from .base import *
from ..env_utils import get_env

DEBUG = False
SECRET_KEY = get_env("DJANGO_SECRET_KEY")
STATIC_URL = get_env("DJANGO_STATIC_URL")
STATIC_ROOT = get_env("DJANGO_STATIC_ROOT")
ALLOWED_HOSTS = get_env("DJANGO_ALLOWED_HOSTS").split(",")

# Nginx is used instead of SecurityMiddleware
# for setting all the recommended security headers
SILENCED_SYSTEM_CHECKS = [
    "security.W001",
]
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "PORT": get_env("POSTGRES_PORT"),
        "HOST": get_env("POSTGRES_HOST"),
        "NAME": get_env("POSTGRES_DB"),
        "USER": get_env("POSTGRES_USER"),
        "PASSWORD": get_env("POSTGRES_PASSWORD"),
        "ATOMIC_REQUESTS": True,
    }
}

# TODO: Add proper handlers
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "filters": {"require_debug_false": {"()": "django.utils.log.RequireDebugFalse"}},
    "formatters": {
        "verbose": {
            "format": "%(levelname)s %(asctime)s %(module)s "
            "%(process)d %(thread)d %(message)s"
        }
    },
    "handlers": {
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "root": {"level": "INFO", "handlers": ["console"]},
    "loggers": {
        "django.request": {"handlers": [], "level": "ERROR", "propagate": True,},
        "django.security.DisallowedHost": {
            "level": "ERROR",
            "handlers": ["console"],
            "propagate": True,
        },
    },
}
