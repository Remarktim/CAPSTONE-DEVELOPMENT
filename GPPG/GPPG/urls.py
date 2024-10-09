from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import path, re_path
from pangolin import views

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('', views.landing_page, name='landing_page'),
    path('login/', views.login_view, name='login'),    
    path('signup/', views.signup_view, name='signup'),
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
    path('pangolin/', views.pangolin_database, name='admin_pangolin_database'),
    path('useraccounts/', views.userAccounts_database, name='admin_userAccounts_database'),
    path('databasegallery/', views.gallery_database, name='admin_gallery_database'),
     path('officers_database/', views.officers_database, name='admin_officers_database'),
    path('admin_officers/', views.admin_officers, name='admin_officers'),
    path('admin_charts/', views.admin_charts, name='admin_charts'),
    path('admin_map/', views.admin_map, name='admin_map'),
    path('admin_report/', views.admin_report, name='admin_report'),
    path('get-poaching-trends/', views.get_poaching_trends, name='get_poaching_trends'),
    path('get-available-years/', views.get_available_years, name='get_available_years'),
]
