import pytest
from rest_framework.reverse import reverse
from django.utils.http import urlencode
from boards.models import Column, Board
from django.contrib.auth import get_user_model

User = get_user_model()


def reverse_querystring(
    view, urlconf=None, args=None, kwargs=None, current_app=None, query_kwargs=None
):
    """
    Custom reverse to handle query strings.

    Usage:
        reverse('app.views.my_view', kwargs={'pk': 123}, query_kwargs={'search', 'Steve'})
    """
    base_url = reverse(
        view, urlconf=urlconf, args=args, kwargs=kwargs, current_app=current_app
    )
    if query_kwargs:
        return f"{base_url}?{urlencode(query_kwargs)}"
    return base_url


def test_user_list(api_client, steve, amy, leo):
    get_user_list = lambda: api_client.get(reverse("user-list"))

    # Not authenticated
    response = get_user_list()
    assert response.status_code == 401

    # Can read all users
    api_client.force_authenticate(user=steve)
    response = get_user_list()
    assert response.status_code == 200
    assert len(response.data) == 3
    assert sorted(list(map(lambda user: user["id"], response.data))) == sorted(
        [steve.id, amy.id, leo.id]
    )


def test_user_list_filters(api_client, steve, amy, leo):
    uni_board = Board.objects.create(name="University", owner=steve)
    uni_board.members.add(steve)
    uni_board.members.add(amy)
    api_client.force_authenticate(user=steve)

    # Can search users
    response = api_client.get(
        reverse_querystring("user-list", query_kwargs={"search": amy.username})
    )
    assert response.status_code == 200
    assert len(response.data) == 1

    search_uni_members_excluded = lambda search: api_client.get(
        reverse_querystring("user-list", query_kwargs={"search": search, "excludemembers": uni_board.id})
    )
    # Steve searches for new members of uni_board
    # He should only be able to search for Leo as Amy is already a member
    # and thus she should be excluded from the list
    response = search_uni_members_excluded(leo.username)
    assert response.status_code == 200
    assert len(response.data) == 1

    response = search_uni_members_excluded(amy.username)
    assert response.status_code == 200
    assert len(response.data) == 0


def test_user_update(api_client, steve, amy):
    update_steve = lambda username: api_client.put(
        reverse("user-detail", kwargs={"pk": steve.id}), {"username": username}
    )

    # Not authenticated
    response = update_steve(username="new_steve")
    assert response.status_code == 401

    # Amy can't update steve
    api_client.force_authenticate(user=amy)
    response = update_steve(username="new_steve")
    assert response.status_code == 403

    # Steve can update
    assert len(User.objects.filter(username="new_steve")) == 0
    api_client.force_authenticate(user=steve)
    response = update_steve(username="new_steve")
    assert response.status_code == 200
    assert len(User.objects.filter(username="new_steve")) == 1

    # Validation for username
    response = update_steve(username="invalid username :)")
    assert response.status_code == 400


def test_user_detail(api_client, steve, amy):
    get_steve = lambda: api_client.get(
        reverse("user-detail", kwargs={"pk": steve.id})
    )

    # Not authenticated
    response = get_steve()
    assert response.status_code == 401

    # Steve can get detail
    api_client.force_authenticate(user=steve)
    response = get_steve()
    assert response.status_code == 200

    # Amy can get Steve detail
    api_client.force_authenticate(user=amy)
    response = get_steve()
    assert response.status_code == 200
