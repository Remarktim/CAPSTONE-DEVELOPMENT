from django.shortcuts import render, redirect
from django.db.models import Count
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from .models import *
from django.http import JsonResponse, HttpResponse
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta
from django.contrib.auth import authenticate, login
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.views.decorators.http import require_POST
from django.views.generic.list import ListView
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.urls import reverse, reverse_lazy
from .forms import *

#PUBLIC
def landing_page(request):
    return render(request, 'public/landing_page.html')

@csrf_exempt
@require_POST
def login_view(request):
    # Retrieve email and password from POST data
    email = request.POST.get('email')
    password = request.POST.get('passwords')

    # Authenticate user
    user = authenticate(request, username=email, password=password)

    if user is not None:
        login(request, user)  # Log the user in
        return JsonResponse({'success': True, 'message': 'Login successful!'}, status=200)
    else:
        return JsonResponse({'success': False, 'error': 'Invalid email or password.'}, status=400)


# Signup View
@csrf_exempt
@require_POST
def signup_view(request):
    # Retrieve form data
    first_name = request.POST.get('first_name')
    last_name = request.POST.get('last_name')
    email = request.POST.get('email')
    password = request.POST.get('passwords')

    # Check if the email is already registered
    if User.objects.filter(email=email).exists():
        return JsonResponse({'success': False, 'error': 'Email already registered.'}, status=400)

    # Password validation
    if len(password) < 8:
        return JsonResponse({'success': False, 'error': 'Password must be at least 8 characters long.'}, status=400)

    # Create a new user
    user = User.objects.create_user(username=email, email=email, password=password, first_name=first_name, last_name=last_name)
    user.save()

    return JsonResponse({'success': True, 'message': 'Registration successful! Please log in.'}, status=200)

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

def pangolin_database(request):
    return render(request, 'admin/database_pangolin.html')

def pangolin_activities(request):
    return render(request, 'admin/database_activities.html')

def userAccounts_database(request):
    return render(request, 'admin/database_userAccounts.html')

def gallery_database(request):
    return render(request, 'admin/database_gallery.html')

def officers_database(request):
    return render(request, 'admin/database_officers.html')

def admin_officers(request):
    return render(request, 'admin/officers.html')

def admin_map(request):
    return render(request, 'admin/map.html')

def admin_report(request):
    return render(request, 'admin/report.html')

def admin_charts(request):
    return render(request, 'admin/charts.html')

def admin_profile(request):
    return render(request, 'admin/profile.html')

#QUERIES

def get_poaching_trends(request):
    period = request.GET.get('period', 'overall')  # Get period from the frontend request

    # Initialize overall trend data
    overall_trend = {
        'alive': [0] * 12,
        'dead': [0] * 12,
        'scales': [0] * 12,
        'illegal_trade': [0] * 12,  # Ensure correct key
    }
    
    # Dictionary to hold yearly reports with monthly data initialized to zero
    yearly_reports = {}

    # Get all reports regardless of the year for yearly reporting
    reports = IncidentReport.objects.all()

    # Aggregate data for overall trend and yearly reports
    aggregated_data = reports.values('date_reported__year', 'date_reported__month', 'incident__status').annotate(count=Count('id'))

    for entry in aggregated_data:
        month_index = entry['date_reported__month'] - 1  # Convert month to 0-index
        status = entry['incident__status']  # Use status directly
        count = entry['count']
        
        # Update overall trend
        if status == 'Alive':
            overall_trend['alive'][month_index] += count
        elif status == 'Dead':
            overall_trend['dead'][month_index] += count
        elif status == 'Scales':
            overall_trend['scales'][month_index] += count
        elif status == 'Illegal Trade':
            overall_trend['illegal_trade'][month_index] += count

        # Update yearly reports with monthly breakdown
        year = entry['date_reported__year']
        if year not in yearly_reports:
            yearly_reports[year] = {
                'alive': [0] * 12,
                'dead': [0] * 12,
                'scales': [0] * 12,
                'illegal_trade': [0] * 12,  # Ensure correct key
            }
        # Update counts for the specific month in the yearly report
        if status == 'Alive':
            yearly_reports[year]['alive'][month_index] += count
        elif status == 'Dead':
            yearly_reports[year]['dead'][month_index] += count
        elif status == 'Scales':
            yearly_reports[year]['scales'][month_index] += count
        elif status == 'Illegal Trade':
            yearly_reports[year]['illegal_trade'][month_index] += count

    # Prepare the final response with the overall trend and yearly reports
    response_data = {
        'overall_trend': overall_trend,
        'yearly_reports': yearly_reports,
    }

    return JsonResponse(response_data)


def get_available_years(request):
    years = IncidentReport.objects.dates('date_reported', 'year').distinct()
    available_years = [year.year for year in years]
    available_years.sort(reverse=True)
    return JsonResponse(available_years, safe=False)
