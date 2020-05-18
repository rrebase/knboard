import pytest

from boards.utils import reverse_querystring


def test_reverse_querystring_multiple():
    assert (
        reverse_querystring(
            "user-search", query_kwargs={"board": "1", "search": "steve"}
        )
        == "/api/u/search/?board=1&search=steve"
    )


def test_reverse_querystring_exception_when_no_qparams():
    with pytest.raises(ValueError):
        reverse_querystring("user-search")
