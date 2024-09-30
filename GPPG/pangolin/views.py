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

def get_poaching_trends(request):
    period = request.GET.get('period', 'thisyear')  # Get period from the frontend request

    # Current year
    current_year = datetime.now().year
    data = {}

    if period == 'thisyear':
        # Filter the reports for the current year and group by month
        reports = IncidentReport.objects.filter(date_reported__year=current_year)
        
        # Aggregate data by month and status
        data = reports.values('date_reported__month', 'incident__status').annotate(count=Count('id'))

    elif period == '1year':
        # Filter the reports for one year ago
        one_year_ago = current_year - 1
        reports = IncidentReport.objects.filter(date_reported__year=one_year_ago)

        # Aggregate data by month and status
        data = reports.values('date_reported__month', 'incident__status').annotate(count=Count('id'))

    elif period == '2years':
        # Filter the reports for the past 2 years
        two_years_ago = current_year - 2
        reports = IncidentReport.objects.filter(date_reported__year__in=[current_year, two_years_ago])

        # Aggregate data by month and status
        data = reports.values('date_reported__month', 'incident__status').annotate(count=Count('id'))

    # Prepare data for JSON response
    result = {
        'alive': [0] * 12,
        'dead': [0] * 12,
        'scales': [0] * 12,
        'illegal_trades': [0] * 12,
    }

    # Populate the result based on aggregated data
    for entry in data:
        month_index = entry['date_reported__month'] - 1  # Month is 1-12, convert to 0-11 index
        status = entry['incident__status']
        count = entry['count']

        if status == 'Alive':
            result['alive'][month_index] = count
        elif status == 'Dead':
            result['dead'][month_index] = count
        elif status == 'Scales':
            result['scales'][month_index] = count
        elif status == 'Illegal Trade':
            result['illegal_trades'][month_index] = count

    return JsonResponse(result)

