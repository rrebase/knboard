from django.apps import apps

from boards.apps import BoardsConfig


def test_config():
    assert BoardsConfig.name == "boards"
    assert apps.get_app_config("boards").name == "boards"
