from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import path, re_path
from pangolin.views import *
from pangolin import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.landing_page, name='landing_page'),
    path('home/', views.home, name='home'),
    path('gallery/', views.gallery, name='gallery'),
    path('gallery_video/', views.gallery_video, name='gallery_video'),
    path('about/', views.about, name='about'),
    path('activities/', views.activities, name='activities'),
    path('trend/', views.trend, name='trend'),
    path('officers/', views.officers, name='officers'),
    path('maps/', views.maps, name='maps'),
    path('account_view/', views.account_view, name='account_view'),
    #ADMIN
    path('admin_home/', views.admin_home, name='admin_home'),
    path('admin_login/', views.admin_login, name='admin_login'),
    path('admin_database/', views.admin_database, name='admin_database'),
    path('admin_database/<pk>', IncidentUpdateView.as_view(), name='incident-update'),
    path('admin_database/<pk>/delete', IncidentDeleteView.as_view(), name='incident-delete'),
    path('admin_officers/', views.admin_officers, name='admin_officers'),
    path('admin_charts/', views.admin_charts, name='admin_charts'),
    path('admin_map/', views.admin_map, name='admin_map'),
    path('admin_report/', views.admin_report, name='admin_report'),
    path('get-poaching-trends/', views.get_poaching_trends, name='get_poaching_trends'),
    path('get-available-years/', views.get_available_years, name='get_available_years'),
]
