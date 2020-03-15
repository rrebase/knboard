from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from boards.models import Board, Task
from boards.serializers import BoardSerializer, TaskSerializer, BoardDetailSerializer


class BoardViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return BoardDetailSerializer
        return super().get_serializer_class()

    def get_queryset(self):
        if self.action == 'retrieve':
            return super().get_queryset().prefetch_related('columns__tasks')
        return super().get_queryset()


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
