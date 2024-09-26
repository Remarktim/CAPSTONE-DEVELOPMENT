from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required



def landing_page(request):
    return render(request, 'public/landing_page.html')

def home(request):
    return render(request, 'private/index.html')

def gallery(request):
    return render(request, 'private/gallery.html')

def gallery_video(request):
    return render(request, 'private/gallery_video.html')

def about(request):
    return render(request, 'private/about.html')

def activities(request):
    return render(request, 'private/activities.html')

def trend(request):
    return render(request, 'private/trend.html')

def officers(request):
    return render(request, 'private/officers.html')

def login(request):
    return render(request, 'private/login.html')

def maps(request):
    return render(request, 'private/maps.html')

def account_view(request):
    return render(request, 'private/account_view.html')