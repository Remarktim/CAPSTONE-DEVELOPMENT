from django.shortcuts import render
from django.db.models import Count
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.template.loader import render_to_string
from .models import *
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta
from django.views.generic.list import ListView
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from .forms import *


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

    incidents = Incident.objects.all()
    return render(request, 'admin/database.html', {'incidents': incidents})

class IncidentDeleteView(DeleteView):
    template_name = 'admin/includes/modal_delete.html'
    model = Incident

    def get_object(self, pk):
        return get_object_or_404(self.model, id=pk)

    def get(self, request, pk):
        
        try:
            incident = self.get_object(pk)
            return render(request, self.template_name, {'object': incident})
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=404)

    def post(self, request, pk):
        try:
            incident = self.get_object(pk)
            incident.delete()
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=400)


def incident_edit(request, pk):
    incident = get_object_or_404(Incident, pk=pk)
    print("Incident ID:", incident.id)
    
    if request.method == 'POST':
        form = IncidentForm(request.POST, instance=incident)
        if form.is_valid():
            form.save()
            return JsonResponse({'success': True})
    else:
        form = IncidentForm(instance=incident)

        
        
    return render(request, 'admin/includes/modal_edit.html', {'form': form})



def admin_officers(request):
    return render(request, 'admin/officers.html')

def admin_map(request):
    return render(request, 'admin/map.html')

def admin_report(request):
    return render(request, 'admin/report.html')

def admin_charts(request):
    return render(request, 'admin/charts.html')

#QUERIES

def get_poaching_trends(request):
    period = request.GET.get('period', 'overall')  

    # Initialize overall trend data
    overall_trend = {
        'alive': [0] * 12,
        'dead': [0] * 12,
        'scales': [0] * 12,
        'illegal_trade': [0] * 12,  
    }
    
    
    yearly_reports = {}
    reports = IncidentReport.objects.all()
    aggregated_data = reports.values('date_reported__year', 'date_reported__month', 'incident__status').annotate(count=Count('id'))

    for entry in aggregated_data:
        month_index = entry['date_reported__month'] - 1  
        status = entry['incident__status']  
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
                'illegal_trade': [0] * 12,  
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
