import pytest
from boards.utils import reverse_querystring


def test_reverse_querystring_multiple():
    assert (
        reverse_querystring(
            "user-list", query_kwargs={"search": "steve", "orderby": "name"}
        )
        == "/api/users/?search=steve&orderby=name"
    )


def test_reverse_querystring_exception_when_no_qparams():
    with pytest.raises(ValueError):
        reverse_querystring("user-list")
