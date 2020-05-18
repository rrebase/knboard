from random import randint

from django.contrib.auth import get_user_model
from django.db import transaction

from accounts.models import Avatar
from .models import Board, Column, Task, Label, Priority

User = get_user_model()


def get_random_avatar():
    pks = Avatar.objects.values_list("pk", flat=True)
    if not pks:
        return None
    return Avatar.objects.get(pk=pks[randint(0, len(pks) - 1)])


@transaction.atomic
def create_demo_board(user):
    board = Board.objects.create(name="Project Abydos", owner=user)
    try:
        alice = User.objects.get(username="alice")
    except User.DoesNotExist:
        alice = User.objects.create_user(
            "alice", email="alice@gmail.com", first_name="Alice", last_name="Design"
        )
        alice.avatar = get_random_avatar()
        alice.save()
    board.members.set([user, alice])

    duplicate = Label.objects.create(name="Duplicate", color="#CCC", board=board)
    review = Label.objects.create(name="Needs review", color="#48C774", board=board)
    bug = Label.objects.create(name="Bug", color="#D0362E", board=board)
    design = Label.objects.create(name="Design 🎨", color="#965CCA", board=board)
    devops = Label.objects.create(name="DevOps", color="#5EA8CB", board=board)
    docs = Label.objects.create(name="Docs", color="#5DCEB3", board=board)
    cookie = Label.objects.create(name="Cookie 🍪", color="#D475CE", board=board)
    enhancement = Label.objects.create(name="Enhancement", color="#AF838E", board=board)

    backlog = Column.objects.create(title="Backlog", board=board)
    requested = Column.objects.create(title="Requested", board=board)
    in_progress = Column.objects.create(title="In progress 🚀", board=board)
    done = Column.objects.create(title="Done 💎", board=board)

    task = Task.objects.create(
        title="Email verifications gives 500",
        description="Noticed that email verifications gives **500** 😲\n\n"
        "Error response with `Debug=True`\n"
        "```\n"
        "Exception at /auth/verify/\nTraceback (most recent call last):\n"
        "  File '<demo.py>', line 55, in <whoopy/doo>\n"
        "IndexError: list index out of range\n"
        "```",
        column=backlog,
        priority=Priority.HIGH,
    )
    task.labels.set([bug])
    task = Task.objects.create(
        title="Email verification fails", description="🔥🚧🔥", column=backlog
    )
    task.labels.set([duplicate])
    task = Task.objects.create(
        title="Prepare runners for Continuous Integration",
        description="☝️ Install the system requirements via **Ansible**.",
        column=backlog,
    )
    task.labels.set([devops])
    task = Task.objects.create(
        title="Search bar",
        description="## 🎯 Requirements\n"
        "- Search through all content\n"
        "- Autocomplete\n- Highlight matches\n"
        "- Catch smaller typos",
        column=backlog,
    )
    task.assignees.set([user, alice])
    task.labels.set([cookie])
    task = Task.objects.create(
        title="Login view form",
        description="Implement login view form that matces design provided by **Alice**. "
        "*Only backend validation for now.*",
        column=requested,
    )
    task.assignees.set([user])
    task.labels.set([enhancement])
    task = Task.objects.create(
        title="Implement Landing page", description="👻" * 10, column=requested
    )
    task.assignees.set([user])
    task.labels.set([enhancement])
    task = Task.objects.create(
        title="Landing page hero block",
        description="The HTTP 418 I'm a teapot client error response code indicates that the server "
        "refuses to brew coffee because it is, permanently, a teapot.\n\n> 418 I'm a teapot",
        column=in_progress,
    )
    task.assignees.set([alice])
    task.labels.set([design, review])
    task = Task.objects.create(
        title="Landing page footer",
        description="| 🥉Good | 🥈Better | 🥇Best |\n"
        "| --- | --- | --- |\n"
        "| 🧀 Cheese | 🍟 Fries | 🍕Pizza |\n"
        "| 🍒 Cherries | 🥝 Kiwi | 🍔 Burger |\n"
        "| 🍩 Donut | 🥐 Croissant  |  🌭 Hot dog |",
        column=in_progress,
    )
    task.assignees.set([alice])
    task.labels.set([design, review])
    task = Task.objects.create(
        title="Project setup documentation",
        description="📚Bad documentation is worse than no documentation. 📚",
        column=in_progress,
        priority=Priority.LOW,
    )
    task.assignees.set([user])
    task.labels.set([docs])
    task = Task.objects.create(
        title="Registration view form", description="🦊" * 10, column=done
    )
    task.assignees.set([user])
    task.labels.set([enhancement])
    emojies = "🐝🦄🐒🐽🍟🌭🍔🐿🐙🦖🐮🐹🐱"
    task = Task.objects.create(
        title="Setup staging server",
        description=f"# {emojies}\n## {emojies}\n### {emojies}\n{emojies}",
        column=done,
    )
    task.labels.set([devops])
