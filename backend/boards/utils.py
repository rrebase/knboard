from django.utils.http import urlencode
from rest_framework.reverse import reverse


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
    if query_kwargs is None:
        raise ValueError("Use reverse()")

    return f"{base_url}?{urlencode(query_kwargs)}"
