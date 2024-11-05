from django.shortcuts import render, redirect
from django.db.models import Count
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from .models import *
from django.http import JsonResponse, HttpResponse
from django.template.response import TemplateResponse
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.views.decorators.http import require_POST
from django.views.generic.list import ListView
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.urls import reverse, reverse_lazy
from .forms import *
from django.db.models import Q
from django.contrib.auth.views import PasswordResetView
from django.contrib.messages.views import SuccessMessageMixin
from django.views.decorators.cache import cache_page
from django.contrib.auth.hashers import make_password, check_password
import json
from .models import User
from .decorator import *
from dotenv import load_dotenv
import google.generativeai as genai
from django.conf import settings
import logging

# Set up logging
logger = logging.getLogger(__name__)
# PUBLIC


@guest_only
def landing_page(request):
    return render(request, 'public/landing_page.html')


@csrf_exempt
@guest_only
def signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            if User.objects.filter(email=data['email']).exists():
                return JsonResponse({'status': 'error', 'message': 'Email already exists'}, status=400)

            user = User.objects.create(
                first_name=data['first_name'],
                last_name=data['last_name'],
                email=data['email'],
                password=make_password(data['password']),
                contact=data['contact']
            )

            request.session['user_id'] = user.id
            request.session['user_email'] = user.email

            return JsonResponse({
                'status': 'success',
                'message': 'User created successfully',
                'user': {
                    'first_name': user.first_name,
                    'email': user.email
                }
            })

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)


@csrf_exempt
@guest_only
def login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': 'Invalid credentials'}, status=400)

            if check_password(password, user.password):

                request.session['user_id'] = user.id
                request.session['user_email'] = user.email

                return JsonResponse({
                    'status': 'success',
                    'message': 'Login successful',
                    'user': {
                        'first_name': user.first_name,
                        'email': user.email
                    }
                })
            else:
                return JsonResponse({'status': 'error', 'message': 'Invalid credentials'}, status=400)

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)


def logout(request):
    request.session.flush()
    return redirect('landing_page')


class CustomPasswordResetView(SuccessMessageMixin, PasswordResetView):
    template_name = 'landingPage/password_reset.html'  # Use your custom template here
    email_template_name = 'registration/password_reset_email.html'
    subject_template_name = 'registration/password_reset_subject.txt'
    success_url = reverse_lazy('landing_page')
    success_message = "A password reset link has been sent to your email."

    def form_valid(self, form):
        messages.success(self.request, self.success_message)
        return super().form_valid(form)


def public_about(request):
    return render(request, 'public/about.html')


def public_officers(request):
    presidents = Officer.objects.filter(position='President')
    vice_presidents = Officer.objects.filter(position='Vice President')
    secretary = Officer.objects.filter(position='Secretary')
    treasurer = Officer.objects.filter(position='Treasurer')
    auditor = Officer.objects.filter(position='Auditor')
    pio_internal = Officer.objects.filter(position='Pio Internal')
    pio_external = Officer.objects.filter(position='Pio External')
    business_manager = Officer.objects.filter(position='Business Manager')
    return render(request, 'public/officers.html', {
        'president': presidents,
        'vice_president': vice_presidents,
        'secretary': secretary,
        'treasurer': treasurer,
        'auditor': auditor,
        'pio_internal': pio_internal,
        'pio_external': pio_external,
        'business_manager': business_manager,
    })


# PRIVATE


@login_required
def home(request):
    try:
        return render(request, 'private/index.html')
    except User.DoesNotExist:
        request.session.flush()
        return redirect('landing_page')


def initialize_genai():
    # Gemini AI with API key from settings
    try:
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            logger.error("GEMINI_API_KEY not found in settings")
            return None

        genai.configure(api_key=api_key)

        model = genai.GenerativeModel(
            model_name='tunedModels/palawan-pangolin-quiojp7cizr2',  # my tune api gemini bot
            generation_config={
                'temperature': 0.9,
                'top_p': 0.95,
                'top_k': 40,
                'max_output_tokens': 2048,
            }
        )
        return model
    except Exception as e:
        logger.error(f"Error initializing Gemini API: {str(e)}")
        return None


def is_pangolin_related(text):
    pangolin_keywords = [
        'pangolin', 'pangolinidae', 'scaly anteater', 'manis', 'pholidota',
        'scales', 'ant', 'termite', 'palawan', 'wildlife', 'endangered',
        'conservation', 'philippines', 'manis culionensis', 'trade', 'poaching',
        'habitat', 'nocturnal', 'mammal', 'species'
    ]
    text_lower = text.lower()
    return any(keyword in text_lower for keyword in pangolin_keywords)


@csrf_exempt
@login_required
def send_message(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_message = data.get('message', '').strip()

            if not user_message:
                return JsonResponse({
                    'status': 'error',
                    'response': 'Please enter a message.'
                })

            if not is_pangolin_related(user_message):
                return JsonResponse({
                    'status': 'success',
                    'response': "I apologize, but I'm specifically designed to discuss pangolins and related topics. Could you please ask me something about pangolins? For example, you could ask about:\n\n" +
                                "• Pangolin characteristics and behavior\n" +
                                "• Pangolin conservation efforts\n" +
                                "• The Palawan pangolin species\n" +
                                "• Pangolin habitat and diet\n" +
                                "• Threats to pangolin survival"
                })

            model = initialize_genai()
            if not model:
                logger.error("Failed to initialize Gemini model")
                return JsonResponse({
                    'status': 'error',
                    'response': 'Chat service is temporarily unavailable. Please try again later.'
                }, status=500)

            try:
                context_prompt = f"""
                Acting as a pangolin expert, please provide accurate information about pangolins in response to this question: {user_message}
                Keep the response focused on pangolin-related information.
                If possible, relate the answer specifically to the Palawan pangolin (Manis culionensis).
                Include scientific facts and conservation information when relevant.
                """

                chat = model.start_chat(history=[])
                response = chat.send_message(context_prompt)

                if response and response.text:
                    return JsonResponse({
                        'status': 'success',
                        'response': response.text
                    })
                else:
                    logger.error("Empty response from model")
                    return JsonResponse({
                        'status': 'error',
                        'response': 'I apologize, but I had trouble processing your question. Please try again.'
                    }, status=500)

            except Exception as e:
                logger.error(f"Error getting model response: {str(e)}")
                return JsonResponse({
                    'status': 'error',
                    'response': 'I apologize, but I had trouble processing your question. Please try again.'
                }, status=500)

        except json.JSONDecodeError:
            logger.error("Invalid JSON in request body")
            return JsonResponse({
                'status': 'error',
                'response': 'Invalid request format. Please send a valid message.'
            }, status=400)

        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return JsonResponse({
                'status': 'error',
                'response': 'An unexpected error occurred. Please try again later.'
            }, status=500)

    return JsonResponse({
        'status': 'error',
        'response': 'Invalid request method.'
    }, status=400)


@login_required
def gallery(request):
    latest_images = Gallery.objects.filter(
        media_type='Image').order_by('-created_at')[:5]
    next_images = Gallery.objects.filter(
        media_type='Image').order_by('-created_at')[5:10]

    context = {
        'latest_images': latest_images,
        'next_images': next_images,
    }
    return render(request, 'private/gallery.html', context)


@login_required
def gallery_video(request):
    latest_videos = Gallery.objects.filter(
        media_type='Video').order_by('-created_at')[:5]
    next_videos = Gallery.objects.filter(
        media_type='Video').order_by('-created_at')[5:10]
    context = {
        'latest_videos': latest_videos,
        'next_videos': next_videos,
    }
    return render(request, 'private/gallery_video.html', context)


@login_required
def about(request):
    return render(request, 'private/about.html')


@login_required
def activities(request):
    # Get latest 5 events
    latest_events = Event.objects.all().order_by('-date')[:5]
    # Get all events for the alternating sections
    all_events = Event.objects.all().order_by('-date')
    return render(request, 'private/activities.html', {
        'latest_events': latest_events,
        'all_events': all_events
    })


@login_required
def trend(request):
    return render(request, 'private/trend.html')


@login_required
def officers(request):
    presidents = Officer.objects.filter(position='President')
    vice_presidents = Officer.objects.filter(position='Vice President')
    secretary = Officer.objects.filter(position='Secretary')
    treasurer = Officer.objects.filter(position='Treasurer')
    auditor = Officer.objects.filter(position='Auditor')
    pio_internal = Officer.objects.filter(position='Pio Internal')
    pio_external = Officer.objects.filter(position='Pio External')
    business_manager = Officer.objects.filter(position='Business Manager')
    return render(request, 'private/officers.html', {
        'president': presidents,
        'vice_president': vice_presidents,
        'secretary': secretary,
        'treasurer': treasurer,
        'auditor': auditor,
        'pio_internal': pio_internal,
        'pio_external': pio_external,
        'business_manager': business_manager,
    })


@login_required
def maps(request):
    return render(request, 'private/maps.html')


@login_required
def account_view(request):
    return render(request, 'private/account_view.html')


@login_required
def user_update_private(request, id):
    user = get_object_or_404(User, id=id)

    if request.method == 'POST':
        form = UserForm(request.POST, request.FILES, instance=user)
        if form.is_valid():
            form.save()
            response = HttpResponse()
            response.headers['HX-Trigger'] = 'closeAndRefresh'
            messages.success(request, 'User Updated!')
            return response
        else:

            return render(request, 'admin/includes/modal/modal_user_edit.html', {
                'form': form,
                'user': user,
            })

    form = UserForm(instance=user)
    return render(request, 'admin/includes/modal/modal_user_edit.html', {
        'form': form,
        'user': user
    })

# ADMIN


def admin_home(request):
    return render(request, 'admin/admin.html')


def admin_login(request):
    return render(request, 'admin/login.html')


class IncidentListView(ListView):
    model = Incident
    context_object_name = "incident"
    template_name = "admin/database_incident.html"

    def get_queryset(self):
        queryset = super().get_queryset()
        status_filter = self.request.GET.getlist('status')

        if status_filter:
            query = Q()
            for status in status_filter:
                query |= Q(status=status)
            queryset = queryset.filter(query)

        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['status_options'] = [
            'Dead', 'Alive', 'Scales', 'Illegal Trade']
        context['selected_statuses'] = self.request.GET.getlist('status')

        return context


def incident_add(request):
    if request.method == 'POST':
        form = IncidentForm(request.POST)
        if form.is_valid():
            form.save()
            response = HttpResponse()
            response.headers['HX-Trigger'] = 'closeAndRefresh'
            messages.success(request, 'Incident Saved!')
            return response
    else:
        form = IncidentForm()

    return render(request, 'admin/includes/modal/modal_incident_add.html', {'form': form})


def incident_update(request, id):
    incident = get_object_or_404(Incident, id=id)

    if request.method == 'POST':
        form = IncidentForm(request.POST, instance=incident)
        if form.is_valid():
            form.save()
            response = HttpResponse()
            response.headers['HX-Trigger'] = 'closeAndRefresh'
            messages.success(request, 'Incident Updated!')
            return response
        else:

            return render(request, 'admin/includes/modal/modal_incident_edit.html', {
                'form': form,
                'incident': incident,
            })

    form = IncidentForm(instance=incident)
    return render(request, 'admin/includes/modal/modal_incident_edit.html', {
        'form': form,
        'incident': incident
    })


def incident_delete(request, id):
    incident = get_object_or_404(Incident, id=id)

    if request.method == 'POST':
        incident.delete()
        response = HttpResponse()
        response.headers['HX-Trigger'] = 'closeAndRefresh'
        messages.success(request, 'Incident Deleted!')
        return response
    else:
        return render(request, 'admin/includes/modal/modal_incident_delete.html', {
            'incident': incident
        })


def cancel_delete(request, id, action=None):
    if action == 'close':
        return HttpResponse()


def pangolin_activities(request):
    return render(request, 'admin/database_activities.html')


def userAccounts_database(request):
    return render(request, 'admin/database_userAccounts.html')


class EventListView(ListView):
    model = Event
    context_object_name = "events"
    template_name = "admin/database_activities.html"


def activity_add(request):
    if request.method == 'POST':
        form = EventForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            response = HttpResponse()
            response.headers['HX-Trigger'] = 'closeAndRefresh'
            messages.success(request, 'Acitivity Saved!')
            return response
    else:
        form = EventForm()

    return render(request, 'admin/includes/modal/modal_activities_add.html', {'form': form})


def activity_update(request, id):
    event = get_object_or_404(Event, id=id)

    if request.method == 'POST':
        form = EventForm(request.POST, request.FILES, instance=event)
        if form.is_valid():
            form.save()
            response = HttpResponse()
            response.headers['HX-Trigger'] = 'closeAndRefresh'
            messages.success(request, 'Activity Updated!')
            return response
        else:

            return render(request, 'admin/includes/modal/modal_activities_edit.html', {
                'form': form,
                'event': event,
            })

    form = EventForm(instance=event)
    return render(request, 'admin/includes/modal/modal_activities_edit.html', {
        'form': form,
        'event': event
    })


def activity_delete(request, id):
    event = get_object_or_404(Event, id=id)

    if request.method == 'POST':
        event.delete()
        response = HttpResponse()
        response.headers['HX-Trigger'] = 'closeAndRefresh'
        messages.success(request, 'Gallery Record Deleted!')
        return response
    else:
        return render(request, 'admin/includes/modal/modal_activities_delete.html', {
            'event': event
        })


class UserListView(ListView):
    model = User
    context_object_name = "users"
    template_name = "admin/database_useracc.html"


def user_add(request):
    if request.method == 'POST':
        form = UserForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            response = HttpResponse()
            response.headers['HX-Trigger'] = 'closeAndRefresh'
            messages.success(request, 'User Saved!')
            return response
    else:
        form = UserForm()

    return render(request, 'admin/includes/modal/modal_user_add.html', {'form': form})


def user_update(request, id):
    user = get_object_or_404(User, id=id)

    if request.method == 'POST':
        form = UserForm(request.POST, request.FILES, instance=user)
        if form.is_valid():
            form.save()
            response = HttpResponse()
            response.headers['HX-Trigger'] = 'closeAndRefresh'
            messages.success(request, 'User Updated!')
            return response
        else:

            return render(request, 'admin/includes/modal/modal_user_edit.html', {
                'form': form,
                'user': user,
            })

    form = UserForm(instance=user)
    return render(request, 'admin/includes/modal/modal_user_edit.html', {
        'form': form,
        'user': user
    })


def user_delete(request, id):
    user = get_object_or_404(User, id=id)

    if request.method == 'POST':
        user.delete()
        response = HttpResponse()
        response.headers['HX-Trigger'] = 'closeAndRefresh'
        messages.success(request, 'User Deleted!')
        return response
    else:
        return render(request, 'admin/includes/modal/modal_user_delete.html', {
            'user': user
        })


class GalleryListView(ListView):
    model = Gallery
    context_object_name = "gallery_items"
    template_name = "admin/database_gallery.html"


def gallery_add(request):
    if request.method == 'POST':
        form = GalleryForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            response = HttpResponse()
            response.headers['HX-Trigger'] = 'closeAndRefresh'
            messages.success(request, 'Gallery Record Saved!')
            return response
    else:
        form = GalleryForm()

    return render(request, 'admin/includes/modal/modal_gallery_add.html', {'form': form})


def gallery_update(request, id):
    gallery = get_object_or_404(Gallery, id=id)

    if request.method == 'POST':
        form = GalleryForm(request.POST, request.FILES, instance=gallery)
        if form.is_valid():
            form.save()
            response = HttpResponse()
            response.headers['HX-Trigger'] = 'closeAndRefresh'
            messages.success(request, 'Gallery Updated!')
            return response
        else:

            return render(request, 'admin/includes/modal/modal_gallery_edit.html', {
                'form': form,
                'gallery': gallery,
            })

    form = GalleryForm(instance=gallery)
    return render(request, 'admin/includes/modal/modal_gallery_edit.html', {
        'form': form,
        'gallery': gallery
    })


def gallery_delete(request, id):
    gallery = get_object_or_404(Gallery, id=id)

    if request.method == 'POST':
        gallery.delete()
        response = HttpResponse()
        response.headers['HX-Trigger'] = 'closeAndRefresh'
        messages.success(request, 'Gallery Record Deleted!')
        return response
    else:
        return render(request, 'admin/includes/modal/modal_gallery_delete.html', {
            'gallery': gallery
        })


class OfficerListView(ListView):
    model = Officer
    context_object_name = "officers"
    template_name = "admin/database_officers.html"


def admin_officers(request):
    presidents = Officer.objects.filter(position='President')
    vice_presidents = Officer.objects.filter(position='Vice President')
    secretary = Officer.objects.filter(position='Secretary')
    treasurer = Officer.objects.filter(position='Treasurer')
    auditor = Officer.objects.filter(position='Auditor')
    pio_internal = Officer.objects.filter(position='Pio Internal')
    pio_external = Officer.objects.filter(position='Pio External')
    business_manager = Officer.objects.filter(position='Business Manager')
    return render(request, 'admin/officers.html', {
        'president': presidents,
        'vice_president': vice_presidents,
        'secretary': secretary,
        'treasurer': treasurer,
        'auditor': auditor,
        'pio_internal': pio_internal,
        'pio_external': pio_external,
        'business_manager': business_manager,
    })


def officer_add(request):
    if request.method == 'POST':
        form = OfficerForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            response = HttpResponse()
            response.headers['HX-Trigger'] = 'closeAndRefresh'
            messages.success(request, 'Officer Saved!')
            return response
    else:
        form = OfficerForm()

    return render(request, 'admin/includes/modal/modal_officer_add.html', {'form': form})


def officer_update(request, id):
    officer = get_object_or_404(Officer, id=id)

    if request.method == 'POST':
        form = OfficerForm(request.POST, request.FILES, instance=officer)
        if form.is_valid():
            form.save()
            response = HttpResponse()
            response.headers['HX-Trigger'] = 'closeAndRefresh'
            messages.success(request, 'Officer Updated!')
            return response
        else:

            return render(request, 'admin/includes/modal/modal_officer_edit.html', {
                'form': form,
                'officer': officer,
            })

    form = OfficerForm(instance=officer)
    return render(request, 'admin/includes/modal/modal_officer_edit.html', {
        'form': form,
        'officer': officer
    })


def officer_delete(request, id):
    officer = get_object_or_404(Officer, id=id)

    if request.method == 'POST':
        officer.delete()
        response = HttpResponse()
        response.headers['HX-Trigger'] = 'closeAndRefresh'
        messages.success(request, 'Officer Deleted!')
        return response
    else:
        return render(request, 'admin/includes/modal/modal_officer_delete.html', {
            'officer': officer
        })


def admin_map(request):
    return render(request, 'admin/map.html')


def admin_report(request):
    return render(request, 'admin/report.html')


def admin_charts(request):
    return render(request, 'admin/charts.html')


def admin_profile(request):
    return render(request, 'admin/profile.html')

# QUERIES


def get_poaching_trends(request):
    # Get period from the frontend request
    period = request.GET.get('period', 'overall')

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
    reports = Incident.objects.all()

    # Aggregate data for overall trend and yearly reports
    aggregated_data = reports.values(
        'created_at__year', 'created_at__month', 'status').annotate(count=Count('id'))

    for entry in aggregated_data:
        month_index = entry['created_at__month'] - \
            1  # Convert month to 0-index
        status = entry['status']  # Use status directly
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
        year = entry['created_at__year']
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


def get_chart_data(request):
    # Get period and status from the frontend request
    period = request.GET.get('period', 'overall')
    status_filter = request.GET.get('status', None)

    # Define statuses if filtering is not applied
    statuses = ['Alive', 'Dead', 'Scales', 'Illegal Trade']
    if status_filter:
        # Split the comma-separated statuses
        statuses = [s.strip() for s in status_filter.split(',')]

    # Initialize dictionaries to hold overall and yearly trends per status
    trends = {status: {'overall': [0] * 12, 'yearly': {}}
              for status in statuses}

    # Get all reports
    reports = Incident.objects.all()

    # Filter reports based on status if specific statuses are requested
    if status_filter:
        reports = reports.filter(status__in=statuses)

    # Rest of your code remains the same...
    aggregated_data = reports.values(
        'created_at__year', 'created_at__month', 'status'
    ).annotate(count=Count('id'))

    for entry in aggregated_data:
        month_index = entry['created_at__month'] - 1
        status = entry['status']
        count = entry['count']
        year = entry['created_at__year']

        if status in trends:
            trends[status]['overall'][month_index] += count

            if year not in trends[status]['yearly']:
                trends[status]['yearly'][year] = [0] * 12
            trends[status]['yearly'][year][month_index] += count

    response_data = {
        f"{status.lower()}_trend": trends[status] for status in statuses}

    return JsonResponse(response_data)


def get_available_years(request):
    years = Incident.objects.dates('created_at', 'year').distinct()
    available_years = [year.year for year in years]
    available_years.sort(reverse=True)
    return JsonResponse(available_years, safe=False)
