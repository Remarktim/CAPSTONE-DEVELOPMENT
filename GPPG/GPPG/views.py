from django.shortcuts import render

def home(request):
    return render(request, 'index.html')

def gallery(request):
    return render(request, 'gallery.html')

def gallery_video(request):
    return render(request, 'gallery_video.html')

def about(request):
    return render(request, 'about.html')

def activities(request):
    return render(request, 'activities.html')

def trend(request):
    return render(request, 'trend.html')

def officers(request):
    return render(request, 'officers.html')

def login(request):
    return render(request, 'login.html')

def maps(request):
    return render(request, 'maps.html')