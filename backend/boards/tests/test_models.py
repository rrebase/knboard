def test_board_owner_added_to_members(board_factory, steve, leo):
    board = board_factory(owner=steve)
    members_ids = [member.id for member in board.members.all()]
    assert steve.id in members_ids
    assert leo.id not in members_ids


def test_str_methods(board, column, task):
    assert str(board) == board.name
    assert str(column) == column.title
    assert str(task) == f"{task.id} - {task.title}"
