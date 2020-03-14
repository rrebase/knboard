from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from boards.models import Board, Task
from boards.serializers import BoardSerializer, TaskSerializer


class BoardViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    permission_classes = [IsAuthenticated]


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
