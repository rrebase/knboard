import os
from .base import *
from ..env_utils import get_env

DEBUG = False
SECRET_KEY = get_env("DJANGO_SECRET_KEY")
STATIC_ROOT = get_env("DJANGO_STATIC_ROOT")
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "localhost").split(",")

# Nginx takes care of it
SECURE_SSL_REDIRECT = False
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
# TODO: set this to 20 seconds first and then to 518400 once you prove the former works
SECURE_HSTS_SECONDS = 20
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True


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
