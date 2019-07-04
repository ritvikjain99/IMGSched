from .models import Meeting, Comment
from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):

	class Meta:
		model = User
		fields = ['id', 'first_name', 'last_name', 'email', 'username']

class MeetingSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=100, source='admin.username', read_only=True)

    class Meta:
        model = Meeting
        fields = ['meeting_id', 'meeting_time', 'isPrivate', 'admin', 'invited', 'meeting_description', 'name']


class CommentSerializer(serializers.ModelSerializer):

	class Meta:
		model = Comment
		fields = '__all__'