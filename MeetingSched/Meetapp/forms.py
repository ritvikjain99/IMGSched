from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.forms import ModelForm
from .models import Meeting


class SignupForm(UserCreationForm):
    email = forms.EmailField(required=True, label="Give a valid Email")
    isAdministrator = forms.BooleanField(label="Signup as Administrator", initial=False, required=False)

    class Meta:
        model = User
        fields = ("username", "password1", "password2", "isAdministrator", "email")

    
class MeetingForm(ModelForm):
    class Meta:
        model = Meeting
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        super(MeetingForm, self).__init__(*args, **kwargs)
        self.fields['description'].widget = TextInput(attrs={
            'class': 'myCustomClass',
        })

        