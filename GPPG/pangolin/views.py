from django.shortcuts import render
from django.db.models import Count
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from .models import Incident, IncidentReport
from django.http import JsonResponse
from datetime import datetime, timedelta



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

def poaching_trends(request):
    period = request.GET.get('period', 'thisyear')  # Get period from the frontend request

    # Current year
    current_year = datetime.now().year
    data = {}

    if period == 'thisyear':
        # Filter the reports for the current year and group by month
        reports = IncidentReport.objects.filter(date_reported__year=current_year)
        data = reports.values('incident__status').annotate(month=Count('date_reported__month'))

    elif period == '1year':
        # Filter the reports for one year ago
        one_year_ago = current_year - 1
        reports = IncidentReport.objects.filter(date_reported__year=one_year_ago)
        data = reports.values('incident__status').annotate(month=Count('date_reported__month'))

    elif period == '2years':
        # Filter the reports for the past 2 years
        two_years_ago = current_year - 2
        reports = IncidentReport.objects.filter(date_reported__year__in=[current_year, two_years_ago])
        data = reports.values('incident__status').annotate(month=Count('date_reported__month'))

    # Prepare data for JSON response
    result = {
        'alive': [d['month'] for d in data if d['incident__status'] == 'Alive'],
        'dead': [d['month'] for d in data if d['incident__status'] == 'Dead'],
        'scales': [d['month'] for d in data if d['incident__status'] == 'Scales'],
        'illegal_trades': [d['month'] for d in data if d['incident__status'] == 'Illegal Trade']
    }

    return render(request, 'private/trend.html')
    
