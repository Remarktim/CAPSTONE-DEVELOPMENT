from django.shortcuts import render

def home(request):
    return render(request, 'home.html')

def gallery(request):
    return render(request, 'gallery.html')

def gallery_video(request):
    return render(request, 'gallery_video.html')

def about(request):
    return render(request, 'about.html')

def activities(request):
    return render(request, 'activities.html')