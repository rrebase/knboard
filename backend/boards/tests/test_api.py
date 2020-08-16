import pytest
from django.contrib.auth import get_user_model
from rest_framework.reverse import reverse

from boards.models import Column, Board, Task

User = get_user_model()


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
            "tasks": {column.id: [task3.id, task1.id, task2.id]},
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
            "tasks": {
                column1.id: [task1.id, task3.id],
                column2.id: [task4.id, task2.id, task5.id],
            },
            "order": [task1.id, task3.id, task4.id, task2.id, task5.id],
        },
    )
    assert response.status_code == 200

    # State after ordering
    column1.refresh_from_db()
    column2.refresh_from_db()
    assert list(column1.tasks.all()) == [task1, task3]
    assert list(column2.tasks.all()) == [task4, task2, task5]


def test_invalid_move_atomic(
    api_client_with_credentials, board_factory, column_factory, task_factory
):
    board = board_factory()
    col1 = column_factory(board=board)
    col2 = column_factory(board=board)
    col3 = column_factory(board=board)
    col1_task = task_factory(column=col1, task_order=1)
    col2_task = task_factory(column=col2, task_order=2)

    response = api_client_with_credentials.post(
        reverse("sort-task"),
        {
            "board": board.id,
            "tasks": {
                col1.id: [col1_task.id, col2_task.id],
                col3.id: [col1_task.id, col2_task.id],
            },
            "order": [col1_task.id, col2_task.id],
        },
    )
    assert response.status_code == 400
    # State should remain the same
    col1.refresh_from_db()
    col2.refresh_from_db()
    col3.refresh_from_db()
    assert list(col1.tasks.all()) == [col1_task]
    assert list(col2.tasks.all()) == [col2_task]
    assert list(col3.tasks.all()) == []


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
            "tasks": {
                board1_col.id: [],
                board2_col.id: [board1_task.id, board2_task.id],
            },
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
    Column.objects.create(id=1, board=board, title="col1")
    Column.objects.create(id=2, board=board, title="col2")

    response = api_client_with_credentials.post(reverse("sort-column"), post_data)
    assert response.status_code == expected_status_code


def test_board_list(api_client, steve, amy, leo):
    uni_board = Board.objects.create(name="University", owner=steve)
    uni_board.members.set([steve, amy])
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
    uni_board.members.set([steve, amy])
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
    uni_board.members.set([steve, amy])
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
    board.members.set([leo, steve])

    # Initially there are two members
    assert len(board.members.all()) == 2

    send_invite = lambda users_ids: api_client.post(
        reverse("board-invite-member", kwargs={"pk": board.id}), {"users": users_ids}
    )

    # Not authenticated
    response = send_invite([amy.id])
    assert response.status_code == 401
    assert len(board.members.all()) == 2

    # Leo is not an owner and should not be able to invite others
    api_client.force_authenticate(user=leo)
    response = send_invite([amy.id])
    assert response.status_code == 403
    assert len(board.members.all()) == 2

    # Steve as the owner should be able to successfully invite Amy
    api_client.force_authenticate(user=steve)
    response = send_invite([amy.id])
    assert response.status_code == 200
    assert len(board.members.all()) == 3
    assert amy.id in list(map(lambda member: member.id, board.members.all()))

    # Should handle adding an existing member
    response = send_invite([steve.id])
    assert response.status_code == 200
    assert len(board.members.all()) == 3

    # Should handle adding non existant user
    response = send_invite([-1])
    assert response.status_code == 400
    assert len(board.members.all()) == 3


def test_board_remove_member(
    api_client, board_factory, column_factory, task_factory, steve, leo, amy, mike
):
    board = board_factory(owner=steve)
    board.members.set([steve, leo, amy])
    column = column_factory(board=board)
    task = task_factory(column=column)

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

    # Steve can remove Leo, should also remove Leo from tasks
    task.assignees.set([leo])
    assert len(task.assignees.all()) == 1
    response = remove_member(leo.username)
    assert response.status_code == 200
    assert len(board.members.all()) == 2
    assert leo.id not in list(map(lambda member: member.id, board.members.all()))
    assert len(task.assignees.all()) == 0


def test_update_task_title(api_client, task_factory, steve, amy):
    task = task_factory(title="Landing page design")
    board = task.column.board
    board.members.set([steve])

    new_title = "Admin page permissions"
    update_title = lambda: api_client.patch(
        reverse("task-detail", kwargs={"pk": task.id}), {"title": new_title}
    )

    # Not authenticated
    response = update_title()
    assert response.status_code == 401

    # Amy not a member, doesn't know about the task
    api_client.force_authenticate(user=amy)
    response = update_title()
    assert response.status_code == 404

    # Steve is a board member, can update
    api_client.force_authenticate(user=steve)
    response = update_title()
    task.refresh_from_db()
    assert response.status_code == 200
    assert task.title == new_title


def test_delete_task(api_client, task_factory, steve, amy):
    task = task_factory()
    board = task.column.board
    board.members.set([steve])

    delete_task = lambda: api_client.delete(
        reverse("task-detail", kwargs={"pk": task.id})
    )

    # Not authenticated
    response = delete_task()
    assert response.status_code == 401

    # Amy not a member, doesn't know about the task
    api_client.force_authenticate(user=amy)
    response = delete_task()
    assert response.status_code == 404

    # Steve is a board member, can delete
    api_client.force_authenticate(user=steve)
    response = delete_task()
    assert response.status_code == 204
    assert not Task.objects.filter(id=task.id).exists()


def test_update_column_title(api_client, column_factory, steve, amy):
    column = column_factory(title="On Hold")
    board = column.board
    board.members.set([steve])

    new_title = "Ready"
    update_column_title = lambda: api_client.patch(
        reverse("column-detail", kwargs={"pk": column.id}), {"title": new_title}
    )

    # Not authenticated
    response = update_column_title()
    assert response.status_code == 401

    # Amy not a member, doesn't know about the column
    api_client.force_authenticate(user=amy)
    response = update_column_title()
    assert response.status_code == 404

    # Steve is a board member, can update
    api_client.force_authenticate(user=steve)
    response = update_column_title()
    column.refresh_from_db()
    assert response.status_code == 200
    assert column.title == new_title


def test_create_column(api_client, board_factory, steve, amy):
    board = board_factory(name="Internals")
    board.members.set([steve])

    column_data = {"title": "Send verification email on Regiser", "board": board.id}
    create_column = lambda post_data: api_client.post(reverse("column-list"), post_data)

    # Not authenticated
    response = create_column(column_data)
    assert response.status_code == 401

    # Amy not a member
    api_client.force_authenticate(user=amy)
    response = create_column(column_data)
    assert response.status_code == 400
    assert response.data[0] == "Must be a member of the board!"

    # Steve is a board member, can create
    api_client.force_authenticate(user=steve)
    response = create_column(column_data)
    assert response.status_code == 201
    assert Column.objects.filter(title=column_data["title"]).exists()


def test_create_task(api_client, column_factory, steve, amy):
    column = column_factory(title="Blocked")
    board = column.board
    board.members.set([steve])

    task_data = {
        "title": "Send verification email on Regiser",
        "description": "<p>Send a verification email when a new user registers. "
        "Email template is provided by Dave.</p><p><br></p><p>Use our main SMTP provider.</p>",
        "column": column.id,
        "labels": [],
        "assignees": [steve.id],
        "priority": "H",
    }

    create_task = lambda post_data: api_client.post(reverse("task-list"), post_data)

    # Not authenticated
    response = create_task(task_data)
    assert response.status_code == 401

    # Amy not a member
    assert amy not in board.members.all()
    api_client.force_authenticate(user=amy)
    response = create_task(task_data)
    assert response.status_code == 400
    assert response.data[0] == "Must be a member of the board!"

    # One of the assignees (amy) is not a member
    api_client.force_authenticate(user=steve)
    response = create_task({**task_data, "assignees": [steve.id, amy.id]})
    assert response.status_code == 400
    assert response.data[0] == "Can't assign someone who isn't a board member!"

    # Steve is a board member, can create
    api_client.force_authenticate(user=steve)
    response = create_task(task_data)
    assert response.status_code == 201
    assert Task.objects.filter(title=task_data["title"]).exists()


def test_only_board_members_see_labels(
    api_client, board_factory, label_factory, steve, amy
):
    board = board_factory(name="Internals")
    board.members.set([steve])

    label = label_factory(name="Documentation", board=board)
    get_label = lambda: api_client.get(reverse("label-detail", kwargs={"pk": label.id}))

    # Steve is a board member, can get label
    api_client.force_authenticate(user=steve)
    response = get_label()
    assert response.status_code == 200

    # Amy is a not a board member, doesn't know about the label
    api_client.force_authenticate(user=amy)
    response = get_label()
    assert response.status_code == 404


def test_add_labels_to_task(
    api_client, board_factory, column_factory, task_factory, label_factory, steve, amy
):
    board1 = board_factory()
    board1.members.set([steve])
    board2 = board_factory()
    column1 = column_factory(board=board1)
    label1 = label_factory(board=board1)
    label2 = label_factory(board=board2)
    task1 = task_factory(column=column1)

    add_labels = lambda labels: api_client.patch(
        reverse("task-detail", kwargs={"pk": task1.id}), {"labels": labels}
    )

    # Can't add a label when not a member
    api_client.force_authenticate(user=amy)
    response = add_labels([label1.id])
    task1.refresh_from_db()
    assert response.status_code == 404
    assert len(task1.labels.all()) == 0

    # Can't add a label from a different board
    api_client.force_authenticate(user=steve)
    response = add_labels([label1.id, label2.id])
    task1.refresh_from_db()
    assert response.status_code == 400
    assert response.data[0] == "Can't set a label that doesn't belong to the board!"
    assert len(task1.labels.all()) == 0

    # Can add a label of this board as member
    api_client.force_authenticate(user=steve)
    response = add_labels([label1.id])
    task1.refresh_from_db()
    assert response.status_code == 200
    assert [label.id for label in task1.labels.all()] == [label1.id]


def test_label_names_unique_per_board(
    api_client, board_factory, label_factory, steve, amy
):
    board = board_factory()
    board.members.set([steve])
    label1 = label_factory(board=board, name="Hotfix")
    label_factory(board=board, name="Bug")
    api_client.force_authenticate(user=steve)
    response = api_client.patch(
        reverse("label-detail", kwargs={"pk": label1.id}), {"name": "Bug"}
    )
    assert response.status_code == 400
