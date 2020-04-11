from django.conf import settings


def test_custom_user_model():
    assert settings.AUTH_USER_MODEL == "accounts.User"
