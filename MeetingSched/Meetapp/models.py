from django.db import models
from django.contrib.auth.models import User

class Meeting(models.Model):
	meeting_id = models.AutoField(primary_key=True)
	meeting_time = models.DateTimeField()
	isPrivate = models.BooleanField()
	admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meeting')
	invited = models.ManyToManyField(User, related_name='invited')
	meeting_description = models.CharField(max_length=100)

	def __str__(self):
		return self.admin.username

class Comment(models.Model):
	author = models.ForeignKey(User, related_name="comments", on_delete=models.CASCADE)
	meeting = models.ForeignKey(Meeting, related_name="comments", on_delete=models.CASCADE)
	text = models.TextField()
	time = models.DateTimeField()

	def __str__(self):
		return self.author.username;