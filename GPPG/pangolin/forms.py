from django.forms import ModelForm

from django.forms import ModelForm, DateTimeInput
from django import forms
from .models import *


class IncidentForm(forms.ModelForm):


    date_reported = forms.DateField(
        widget=forms.DateInput(attrs={
            'type': 'date',  # 'date' input type triggers browser date picker
            'class': 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5',
            'placeholder': 'Select Date',
        })
    )
    class Meta:
        model = Incident
        fields = "__all__"

        labels = {
            'municipality': 'Municipality',
            'city': 'City',
            'status': 'Status',
            'date_reported': 'Date Reported',
            'description': 'Description',
        }



        widgets = {
            'municipality': forms.Select(attrs={
                'class': 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500',
                'placeholder': 'Enter Municipality'
            }),
            'city': forms.Select(attrs={
                'class': 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500',
                'placeholder': 'Enter City'
            }),
            'status': forms.Select(attrs={
                'class': 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
            }),
            'description': forms.Textarea(attrs={
                'class': 'block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500',
                'placeholder': 'Write a description here'
            }),
        }


class OfficerForm(forms.ModelForm):

    date_joined = forms.DateField(
        widget=forms.DateInput(attrs={
            'type': 'date',  # 'date' input type triggers browser date picker
            'class': 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5',
            'placeholder': 'Select Date',
        })
    )

    class Meta:
        model = Officer
        fields = "__all__"

        labels = {
            'first_name': 'First Name',
            'last_name': 'Last Name',
            'date_joined': 'Date Joined',
            'position': 'Position',
            'fb_url': 'Facebook Link',
            'ig_url': 'Instagram Link',
            'officer_image': 'Profile Image',
        }

        widgets = {
            'first_name': forms.TextInput(attrs={
                'class': 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500',
                'placeholder': 'Enter First Name'
            }),
            'last_name': forms.TextInput(attrs={
                'class': 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500',
                'placeholder': 'Enter Last Name'
            }),
            'position': forms.Select(choices=Officer.pos_choices, attrs={
                'class': 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500',
                'placeholder': 'Enter Position in the Organization'
            }),
            'fb_url': forms.URLInput(attrs={
                'class': 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500',
                'placeholder': 'Enter your full Facebook profile link (e.g., https://www.facebook.com/your.custom.url)',
                'required': 'required'
            }),
            'ig_url': forms.URLInput(attrs={
                'class': 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500',
                'placeholder': 'Enter your full Instagram profile link (e.g., https://www.instagram.com/your.custom.url)'
            }),
            'officer_image': forms.ClearableFileInput(attrs={
                'class': 'block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer',
            }),
        }

    def clean_fb_url(self):
        fb_url = self.cleaned_data.get('fb_url')
        if fb_url and not fb_url.startswith('https://'):
            raise ValidationError('The Facebook URL must start with https.')
        return fb_url

    def clean_ig_url(self):
        ig_url = self.cleaned_data.get('ig_url')
        if ig_url and not ig_url.startswith('https://'):
            raise ValidationError('The Instagram URL must start with https.')
        return ig_url


class GalleryForm(forms.ModelForm):
    class Meta:
        model = Gallery
        fields = ['uploader', 'media']

        labels = {
            'uploader': 'Uploader',
            'media': 'Media',
        }
        widgets = {
            'uploader': forms.TextInput(attrs={
                'class': 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5',
                'placeholder': 'Enter your name',
            }),
            'media': forms.ClearableFileInput(attrs={
                'class': 'block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer',
            }),
        }


class EventForm(forms.ModelForm):
    date = forms.DateField(
        widget=forms.DateInput(attrs={
            'type': 'date',
            'class': 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5',
            'placeholder': 'Select Date',
        })
    )
    event_image = forms.ImageField(
        widget=forms.ClearableFileInput(attrs={
            'class': 'hidden',
        }),
    )

    class Meta:
        model = Event
        fields = "__all__"

        labels = {
            'name': 'Name of Acitivity',
            'date': 'Date',
            'description': 'Description',
            'location': 'Location',
            'event_image': 'Image for the Activity'
        }

        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500',
                'placeholder': 'Enter Activity Name'
            }),
            'description': forms.Textarea(attrs={
                'class': 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500',
                'placeholder': 'Enter Activity Description'
            }),
            'location': forms.TextInput(attrs={
                'class': 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500',
                'placeholder': 'Enter Activity Location'
            }),
            'event_image': forms.ClearableFileInput(attrs={
                'class': 'hidden',
                'accept': 'image/*'
            }),
        }


class UserForm(forms.ModelForm):

    class Meta:
        model = User
        fields = "__all__"

        labels = {
            'first_name': 'First Name',
            'last_name': 'Last Name',
            'email': 'Email',
            'contact': 'Contact Number',
            'password': 'Password',
        }

        widgets = {
            'first_name': forms.TextInput(attrs={
                'class': 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500',
                'placeholder': 'Enter First Name'
            }),
            'last_name': forms.TextInput(attrs={
                'class': 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500',
                'placeholder': 'Enter Last Name'
            }),
            'email': forms.TextInput(attrs={
                'class': 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500',
                'placeholder': 'Enter your Email Address'
            }),

            'contact': forms.TextInput(attrs={
                'class': 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500',
                'placeholder': 'Enter your contact number'
            }),

            'password': forms.TextInput(attrs={
                'class': 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500',
                'placeholder': 'Use atleast 8 characters'
            }),
        }
