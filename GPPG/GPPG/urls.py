from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import path, re_path
from pangolin import views
from pangolin.views import *
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),

    path('', views.landing_page, name='landing_page'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),

    path('about./', views.public_about, name='public_about'),
    path('officers./', views.public_officers, name='public_officers'),
    path('home/', views.home, name='home'),

    path('gallery/', views.gallery, name='gallery'),
    path('gallery_video/', views.gallery_video, name='gallery_video'),
    path('about/', views.about, name='about'),
    path('activities/', views.activities, name='activities'),
    path('trend/', views.trend, name='trend'),
    path('officers/', views.officers, name='officers'),
    path('maps/', views.maps, name='maps'),
    path('account_view/', views.account_view, name='account_view'),
    # ADMIN
    path('admin_home/', views.admin_home, name='admin_home'),
    path('admin_login/', views.admin_login, name='admin_login'),
    path('admin_profile/', views.admin_profile, name='admin_profile'),
    path('activities_database/', EventListView.as_view(),
         name='admin_activities_database'),
    path('activities_database/add', views.activity_add,
         name='admin_activities_add'),
    path('activities_database/<int:id>',
         views.activity_update, name='admin_activities_edit'),
    path('activities_database/<int:id>/delete',
         views.activity_delete, name='admin_activities_delete'),
    path('incidents/', IncidentListView.as_view(),
         name='admin_incident_database'),
    path('incidents/add', views.incident_add, name='admin_incident_add'),
    path('incidents/<int:id>/', views.incident_update, name='admin_incident_edit'),
    path('incidents/<int:id>/delete', views.incident_delete,
         name='admin_incident_delete'),
    path('useraccounts/', UserListView.as_view(),
         name='admin_userAccounts_database'),
    path('useraccounts/add', views.user_add, name='admin_userAccounts_add'),
    path('useraccounts/<int:id>', views.user_update,
         name='admin_userAccounts_edit'),
    path('useraccounts/<int:id>/delete', views.user_delete,
         name='admin_userAccounts_delete'),
    path('databasegallery/', GalleryListView.as_view(),
         name='admin_gallery_database'),
    path('databasegallery/add', views.gallery_add, name='admin_gallery_add'),
    path('databasegallery/<int:id>',
         views.gallery_update, name='admin_gallery_edit'),
    path('databasegallery/<int:id>/delete',
         views.gallery_delete, name='admin_gallery_delete'),
    path('officers_database/', OfficerListView.as_view(),
         name='admin_officers_database'),
    path('officers_database/add', views.officer_add, name='admin_officers_add'),
    path('officers_database/<int:id>/',
         views.officer_update, name='admin_officers_edit'),
    path('officers_database/<int:id>/delete',
         views.officer_delete, name='admin_officers_delete'),
    path('canceldelete/<int:id>/', views.cancel_delete,
         {'action': 'close'}, name='cancel-delete'),
    path('admin_officers/', views.admin_officers, name='admin_officers'),
    path('admin_charts/', views.admin_charts, name='admin_charts'),
    path('admin_map/', views.admin_map, name='admin_map'),
    path('admin_report/', views.admin_report, name='admin_report'),
    path('get-poaching-trends/', views.get_poaching_trends,
         name='get_poaching_trends'),
    path('get-available-years/', views.get_available_years,
         name='get_available_years'),


    path('password_reset/', views.CustomPasswordResetView.as_view(),
         name='password_reset'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
