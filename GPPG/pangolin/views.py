from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required


#PUBLIC
def landing_page(request):
    return render(request, 'public/landing_page.html')

#PRIVATE
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
    return render(request, 'private/login_admin.html')

def maps(request):
    return render(request, 'private/maps.html')

def account_view(request):
    return render(request, 'private/account_view.html')

#ADMIN
def admin_home(request):
    return render(request, 'admin/admin.html')

def admin_login(request):
    return render(request, 'admin/login.html')

def admin_database(request):
    return render(request, 'admin/database.html')

def admin_officers(request):
    return render(request, 'admin/officers.html')

def admin_map(request):
    return render(request, 'admin/map.html')

def admin_report(request):
    return render(request, 'admin/report.html')

def admin_charts(request):
    return render(request, 'admin/charts.html')