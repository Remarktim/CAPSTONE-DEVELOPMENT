from django.forms import ModelForm, DateTimeInput
from django import forms
from .models import *

class IncidentForm(ModelForm):
    date_time = forms.DateTimeField(
        widget=DateTimeInput(attrs={
            'type': 'datetime-local',
            'class': 'form-control',  # You can add any class you need for styling
            'placeholder': 'Select Date and Time',
        })
    )
    class Meta:
        model = Incident
        fields = "__all__"
        labels = {
            'location': 'Location',  
            'date_time': 'Date Time',  
            'severity_level': 'Severity Level',
            'description': 'Description',
        }