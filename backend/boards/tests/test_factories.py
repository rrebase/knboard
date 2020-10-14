import re


def test_user_factory(user_factory):
    user = user_factory()
    assert re.match(r"jack\d+", user.username)
    assert re.match(r"jack\d+@stargate.com", user.email)

    user = user_factory(username="steve")
    assert user.username == "steve"


def test_board_factory(board_factory):
    board = board_factory()
    assert re.match(r"uni\d+", board.name)
    assert board.owner


def test_column_factory(column_factory):
    column = column_factory(title="In Progress")
    assert column.title == "In Progress"


def test_task_factory(task_factory):
    task = task_factory()
    assert re.match(r"task\d+", task.title)


def test_label_factory(label_factory):
    label = label_factory()
    assert re.match(r"label\d+", label.name)
    assert re.match(r"#\w{6}", label.color)


def test_comment_factory(comment_factory):
    comment = comment_factory()
    assert comment.task
    assert comment.author
    assert comment.text
