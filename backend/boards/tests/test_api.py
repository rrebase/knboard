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


def test_order_tasks_same_column(
    api_client_with_credentials, column_factory, task_factory
):
    """
    Order tasks (in one column):
    Task1, Task2, Task3 -> Task3, Task1, Task2
    """
    column = column_factory()
    task1 = task_factory(column=column, task_order=1)
    task2 = task_factory(column=column, task_order=2)
    task3 = task_factory(column=column, task_order=3)

    # Initial state
    column.refresh_from_db()
    assert list(column.tasks.all()) == [task1, task2, task3]

    response = api_client_with_credentials.post(
        reverse("sort-task"),
        {
            "board": column.board.id,
            "tasks": {column.title: [task3.id, task1.id, task2.id]},
            "order": [task3.id, task1.id, task2.id],
        },
    )
    assert response.status_code == 200

    # State after ordering
    column.refresh_from_db()
    assert list(column.tasks.all()) == [task3, task1, task2]


def test_order_tasks_between_two_columns(
    api_client_with_credentials, board_factory, column_factory, task_factory
):
    """
    Order tasks between two columns:
    Column1: Task1, Task2, Task3
    Column2: Task4, Task5
    After order:
    Column1: Task1, Task3
    Column2: Task4, Task2, Task5
    """
    board = board_factory()
    column1 = column_factory(board=board)
    column2 = column_factory(board=board)
    task1 = task_factory(column=column1, task_order=1)
    task2 = task_factory(column=column1, task_order=2)
    task3 = task_factory(column=column1, task_order=3)
    task4 = task_factory(column=column2, task_order=4)
    task5 = task_factory(column=column2, task_order=5)

    # Initial state
    column1.refresh_from_db()
    column2.refresh_from_db()
    assert list(column1.tasks.all()) == [task1, task2, task3]
    assert list(column2.tasks.all()) == [task4, task5]

    response = api_client_with_credentials.post(
        reverse("sort-task"),
        {
            "board": column1.board.id,
            "tasks": {column1.title: [task1.id, task3.id], column2.title: [task4.id, task2.id, task5.id]},
            "order": [task1.id, task3.id, task4.id, task2.id, task5.id],
        },
    )
    assert response.status_code == 200

    # State after ordering
    column1.refresh_from_db()
    column2.refresh_from_db()
    assert list(column1.tasks.all()) == [task1, task3]
    assert list(column2.tasks.all()) == [task4, task2, task5]


def test_can_not_order_tasks_between_two_boards(
    api_client_with_credentials, board_factory, column_factory, task_factory
):
    board1 = board_factory()
    board2 = board_factory()
    board1_col = column_factory(board=board1)
    board2_col = column_factory(board=board2)
    board1_task = task_factory(column=board1_col, task_order=1)
    board2_task = task_factory(column=board2_col, task_order=2)

    response = api_client_with_credentials.post(
        reverse("sort-task"),
        {
            "board": board1.id,
            "tasks": {board1_col.title: [], board2_col.title: [board1_task.id, board2_task.id]},
            "order": [board1_task.id, board2_task.id],
        },
    )
    assert response.status_code == 400


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

    # Owner can see his own boards
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

    # Owner can see his own board
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

    # Owner can see his own board
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

    # Steve should be owner and member after creation
    api_client.force_authenticate(user=steve)
    response = create_board()
    assert response.status_code == 201
    assert len(Board.objects.all()) == 1
    pets = Board.objects.get(name="Pets")
    assert pets.owner == steve
    assert list(pets.members.all()) == [steve]

    # Amy should not see any boards
    api_client.force_authenticate(user=amy)
    response = api_client.get(reverse("board-list"))
    assert response.status_code == 200
    assert len(response.data) == 0


def test_board_invite_member(api_client, board_factory, steve, leo, amy):
    board = board_factory(owner=steve)
    board.members.add(leo)
    board.save()

    # Initially there are two members
    assert len(board.members.all()) == 2

    send_invite = lambda username: api_client.post(
        reverse("board-invite-member", kwargs={"pk": board.id}), {"username": username}
    )

    # Not authenticated
    response = send_invite(amy.username)
    assert response.status_code == 401
    assert len(board.members.all()) == 2

    # Leo is not an owner and should not be able to invite others
    api_client.force_authenticate(user=leo)
    response = send_invite(amy.username)
    assert response.status_code == 403
    assert len(board.members.all()) == 2

    # Steve as the owner should be able to successfully invite Amy
    api_client.force_authenticate(user=steve)
    response = send_invite(amy.username)
    assert response.status_code == 200
    assert len(board.members.all()) == 3
    assert amy.id in list(map(lambda member: member.id, board.members.all()))

    # Should handle adding an existing member
    response = send_invite(steve.username)
    assert response.status_code == 200
    assert len(board.members.all()) == 3

    # Should handle adding non existant user
    response = send_invite("notvalidusername")
    assert response.status_code == 400
    assert len(board.members.all()) == 3


def test_board_remove_member(api_client, board_factory, steve, leo, amy, mike):
    board = board_factory(owner=steve)
    board.members.add(leo)
    board.members.add(amy)
    board.save()

    # Initially there are two members
    assert len(board.members.all()) == 3

    remove_member = lambda username: api_client.post(
        reverse("board-remove-member", kwargs={"pk": board.id}), {"username": username}
    )

    # Not authenticated
    response = remove_member(leo.username)
    assert response.status_code == 401
    assert len(board.members.all()) == 3

    # Leo should not be able to remove Amy (Leo isn't the owner)
    api_client.force_authenticate(user=leo)
    response = remove_member(amy.username)
    assert response.status_code == 403
    assert len(board.members.all()) == 3

    # Steve can't remove himself (the owner)
    api_client.force_authenticate(user=steve)
    response = remove_member(steve.username)
    assert response.status_code == 400
    assert len(board.members.all()) == 3

    # Steve can't remove Mike (not a member of the board)
    response = remove_member(mike.username)
    assert response.status_code == 400
    assert len(board.members.all()) == 3

    # Steve can't remove a non existant user
    response = remove_member("notvalidusername")
    assert response.status_code == 400
    assert len(board.members.all()) == 3

    # Steve can remove Leo
    response = remove_member(leo.username)
    assert response.status_code == 200
    assert len(board.members.all()) == 2
    assert leo.id not in list(map(lambda member: member.id, board.members.all()))
