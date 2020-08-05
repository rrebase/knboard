from .base import *

# Dummy value for development
SECRET_KEY = "*m(r@4mdh*!zabwg&6tp%mgs_ezkprs9g+$@x@cdq-z_)dtf2i"

DEBUG_TOOLBAR = False

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "knboard",
        "USER": "knboard",
        "PASSWORD": "knboard",
        "HOST": "localhost",
        "PORT": 5432,
    }
}

if DEBUG_TOOLBAR:
    # Add django extensions
    INSTALLED_APPS += ["debug_toolbar"]
    MIDDLEWARE = ["debug_toolbar.middleware.DebugToolbarMiddleware"] + MIDDLEWARE

    # Configure django-debug-toolbar
    DEBUG_TOOLBAR_PANELS = [
        "ddt_request_history.panels.request_history.RequestHistoryPanel",
        "debug_toolbar.panels.versions.VersionsPanel",
        "debug_toolbar.panels.timer.TimerPanel",
        "debug_toolbar.panels.settings.SettingsPanel",
        "debug_toolbar.panels.headers.HeadersPanel",
        "debug_toolbar.panels.request.RequestPanel",
        "debug_toolbar.panels.sql.SQLPanel",
        "debug_toolbar.panels.templates.TemplatesPanel",
        "debug_toolbar.panels.staticfiles.StaticFilesPanel",
        "debug_toolbar.panels.cache.CachePanel",
        "debug_toolbar.panels.signals.SignalsPanel",
        "debug_toolbar.panels.logging.LoggingPanel",
        "debug_toolbar.panels.redirects.RedirectsPanel",
        "debug_toolbar.panels.profiling.ProfilingPanel",
    ]

    # Needed for django-debug-toolbar
    INTERNAL_IPS = [
        "127.0.0.1",
    ]
