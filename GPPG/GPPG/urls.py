from django.contrib import admin
from django.urls import path, include
from pangolin import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('home/', views.home, name='home'),
    path('', views.landing_page, name='landing_page'),
    path('gallery/', views.gallery, name='gallery'),
    path('gallery_video/', views.gallery_video, name='gallery_video'),
    path('about/', views.about, name='about'),
    path('activities/', views.activities, name='activities'),
    path('trend/', views.trend, name='trend'),
    path('officers/', views.officers, name='officers'),
    path('login/', views.login, name='login'),
    path('maps/', views.maps, name='maps'),
    path('account_view/', views.account_view, name='account_view'),
    
]
