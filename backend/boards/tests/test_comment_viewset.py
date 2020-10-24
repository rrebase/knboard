from django.urls import reverse

from boards.models import Comment


def test_create_comment_success(api_client, task_factory, steve):
    task = task_factory()
    board = task.column.board
    board.members.set([steve])

    # Steve is a board member, can add a comment
    api_client.force_authenticate(user=steve)
    assert Comment.objects.all().count() == 0
    response = api_client.post(
        reverse("comment-list"), {"task": task.id, "text": "Steve's comment"},
    )
    assert response.status_code == 201
    assert Comment.objects.all().count() == 1
    assert Comment.objects.first().author == steve


def test_create_comment_not_authenticated(api_client, task_factory):
    task = task_factory()

    # Not authenticated
    response = api_client.post(
        reverse("comment-list"), {"task": task.id, "text": "anonymous comment"},
    )
    assert response.status_code == 401
    assert Comment.objects.all().count() == 0


def test_create_comment_invalid_task(api_client, task_factory, amy):
    task = task_factory()

    # Amy not a member of the board where this task is
    api_client.force_authenticate(user=amy)
    response = api_client.post(
        reverse("comment-list"), {"task": task.id, "text": "Amy's comment"},
    )
    assert response.status_code == 400
    assert Comment.objects.all().count() == 0


def test_delete_comment_success(api_client, task_factory, comment_factory, steve):
    task = task_factory()
    task.column.board.members.set([steve])
    comment = comment_factory(task=task, author=steve)

    # Steve is the author of the comment, he can delete it
    api_client.force_authenticate(user=steve)
    assert Comment.objects.all().count() == 1
    response = api_client.delete(reverse("comment-detail", kwargs={"pk": comment.id}))
    assert response.status_code == 204
    assert Comment.objects.all().count() == 0


def test_delete_comment_not_authenticated(
    api_client, task_factory, comment_factory, steve
):
    task = task_factory()
    task.column.board.members.set([steve])
    comment = comment_factory(task=task, author=steve)

    # Not authenticated
    assert Comment.objects.all().count() == 1
    response = api_client.delete(reverse("comment-detail", kwargs={"pk": comment.id}))
    assert response.status_code == 401
    assert Comment.objects.all().count() == 1


def test_delete_comment_not_author(
    api_client, task_factory, comment_factory, steve, amy
):
    task = task_factory()
    task.column.board.members.set([steve, amy])
    comment = comment_factory(task=task, author=steve)

    # Amy is not the author of the comment, she can't delete it
    api_client.force_authenticate(user=amy)
    assert Comment.objects.all().count() == 1
    response = api_client.delete(reverse("comment-detail", kwargs={"pk": comment.id}))
    assert response.status_code == 400
    assert Comment.objects.all().count() == 1
