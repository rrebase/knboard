import pytest
import re


@pytest.mark.django_db
def test_user_user_factory(user_factory):
    user = user_factory()
    assert re.match(r"jack\d+", user.username)
    assert re.match(r"jack\d+@stargate.com", user.email)
    assert user.check_password("jackpassword")

    user = user_factory(username="steve")
    assert user.username == "steve"
