from django.contrib.auth.models import User
from .models import Comment, Meeting
from django.shortcuts import get_object_or_404
from .serializers import UserSerializer, MeetingSerializer, CommentSerializer
from rest_framework import viewsets, mixins
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny



class UserViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing user instances.
    """
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated,)

    @action(detail=True)
    def meeting(self, request, pk=None):
        queryset = User.objects.get(pk=pk).meeting.all()
        serializer = MeetingSerializer(queryset, many=True)
        print(queryset)
        return Response(serializer.data)

    def get_object(self):
        queryset = self.get_queryset()
        queryset = self.filter_queryset(queryset)
        filter = {}
        print(self.kwargs['pk'].isnumeric())
        if self.kwargs['pk'].isnumeric():
            filter['pk'] = self.kwargs['pk']
        else:
            filter['username'] = self.kwargs['pk']
        return get_object_or_404(queryset, **filter)

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny(), ]        
        return super(UserViewSet, self).get_permissions()       


class MeetingViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing user instances.
    """
    serializer_class = MeetingSerializer
    queryset = Meeting.objects.order_by('meeting_time')
    permission_classes = (IsAuthenticated,)


class CommentViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing user instances.
    """
    serializer_class = CommentSerializer
    queryset = Comment.objects.order_by('time')
    # permission_classes = (IsAuthenticated,)
    
    def retrieve(self, request, pk=None):
        queryset = Comment.objects.filter(meeting_id=pk)
        serializer = CommentSerializer(queryset, many=True)
        return Response(serializer.data)


