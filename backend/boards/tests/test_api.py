import pytest
from rest_framework.reverse import reverse
from boards.models import Column, Board

pytestmark = pytest.mark.django_db


@pytest.fixture
def board():
    return Board.objects.create(name="University")


@pytest.fixture
def col_backlog(board):
    return Column.objects.create(board=board, title="Backlog", column_order=1)


@pytest.fixture
def col_done(board):
    return Column.objects.create(board=board, title="Done", column_order=2)


def test_order_columns(api_client_with_credentials, col_backlog, col_done):
    """
    Order columns:
    Backlog, Done -> Done, Backlog
    """
    # response = self.post_data({"order": [self.col_done.id, self.col_backlog.id]})
    response = api_client_with_credentials.post(
        reverse("sort-column"), {"order": [col_done.id, col_backlog.id]}
    )

    col_backlog.refresh_from_db()
    col_done.refresh_from_db()

    assert response.status_code == 200
    assert col_done.column_order == 1
    assert col_backlog.column_order == 2


def test_order_duplicate(api_client_with_credentials, col_done):
    response = api_client_with_credentials.post(
        reverse("sort-column"), {"order": [col_done.id, col_done.id]}
    )
    assert response.status_code == 400


@pytest.mark.parametrize(
    "post_data,expected_status_code",
    [
        ({"order": [1, 2]}, 200),
        ({"order": [1, 1]}, 400),
        ({"order": [-1]}, 400),
        ({"order": "nope"}, 400),
        ({"order": {"asd"}}, 400),
        ({"other": "bad data"}, 400),
        ({}, 400),
    ]
)
def test_order_column_status_code(post_data, expected_status_code, api_client_with_credentials, board):
    Column.objects.create(board=board, title="col1")
    Column.objects.create(board=board, title="col2")

    response = api_client_with_credentials.post(reverse("sort-column"), post_data)
    assert response.status_code == expected_status_code
