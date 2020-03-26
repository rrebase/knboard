import pytest
from rest_framework.reverse import reverse
from boards.models import Column, Board


@pytest.fixture
def board(create_user):
    user = create_user()
    uni_board = Board.objects.create(name="University", owner=user)
    uni_board.members.add(user)
    return uni_board


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
    ],
)
def test_order_column_status_code(
    post_data, expected_status_code, api_client_with_credentials, board
):
    Column.objects.create(board=board, title="col1")
    Column.objects.create(board=board, title="col2")

    response = api_client_with_credentials.post(reverse("sort-column"), post_data)
    assert response.status_code == expected_status_code


def test_board_list(api_client, steve, amy, leo):
    uni_board = Board.objects.create(name="University", owner=steve)
    uni_board.members.add(steve)
    uni_board.members.add(amy)
    get_board_list = lambda: api_client.get(reverse("board-list"))

    # Not authenticated
    response = get_board_list()
    assert response.status_code == 401

    # Owner can see he's own boards
    api_client.force_authenticate(user=steve)
    response = get_board_list()
    assert response.status_code == 200
    assert len(response.data) == 1

    # Members can see the their boards
    api_client.force_authenticate(user=amy)
    response = get_board_list()
    assert response.status_code == 200
    assert len(response.data) == 1

    # Not part of any boards, can't see any
    api_client.force_authenticate(user=leo)
    response = get_board_list()
    assert response.status_code == 200
    assert len(response.data) == 0


def test_board_detail(api_client, steve, amy, leo):
    uni_board = Board.objects.create(name="University", owner=steve)
    uni_board.members.add(steve)
    uni_board.members.add(amy)
    get_uni_board_detail = lambda: api_client.get(
        reverse("board-detail", kwargs={"pk": uni_board.id})
    )

    # Not authenticated
    response = get_uni_board_detail()
    assert response.status_code == 401

    # Owner can see he's own board
    api_client.force_authenticate(user=steve)
    response = get_uni_board_detail()
    assert response.status_code == 200
    assert response.data["name"] == "University"

    # Member can see the board
    api_client.force_authenticate(user=amy)
    response = get_uni_board_detail()
    assert response.status_code == 200
    assert response.data["name"] == "University"

    # Not part of the board, can't see it
    api_client.force_authenticate(user=leo)
    response = get_uni_board_detail()
    assert response.status_code == 404


def test_board_delete(api_client, steve, amy, leo):
    uni_board = Board.objects.create(name="University", owner=steve)
    uni_board.members.add(steve)
    uni_board.members.add(amy)
    delete_uni_board = lambda: api_client.delete(
        reverse("board-detail", kwargs={"pk": uni_board.id})
    )

    # Not authenticated
    response = delete_uni_board()
    assert response.status_code == 401
    assert Board.objects.filter(id=uni_board.id).exists()

    # Not part of the board, can't see it
    api_client.force_authenticate(user=leo)
    response = delete_uni_board()
    assert response.status_code == 404
    assert Board.objects.filter(id=uni_board.id).exists()

    # Member can't delete the board
    api_client.force_authenticate(user=amy)
    response = delete_uni_board()
    assert response.status_code == 403
    assert Board.objects.filter(id=uni_board.id).exists()

    # Owner can see he's own board
    api_client.force_authenticate(user=steve)
    response = delete_uni_board()
    assert response.status_code == 204
    assert not Board.objects.filter(id=uni_board.id).exists()


def test_board_create(api_client, steve, amy):
    assert len(Board.objects.all()) == 0
    create_board = lambda: api_client.post(reverse("board-list"), {"name": "Pets"})

    # Not authenticated
    response = create_board()
    assert response.status_code == 401
    assert len(Board.objects.all()) == 0

    # steve should be owner and member after creation
    api_client.force_authenticate(user=steve)
    response = create_board()
    assert response.status_code == 201
    assert len(Board.objects.all()) == 1
    pets = Board.objects.get(name="Pets")
    assert pets.owner == steve
    assert list(pets.members.all()) == [steve]

    # amy should not see any boards
    api_client.force_authenticate(user=amy)
    response = api_client.get(reverse("board-list"))
    assert response.status_code == 200
    assert len(response.data) == 0
