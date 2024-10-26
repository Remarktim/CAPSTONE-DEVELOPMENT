# middleware.py
from django.shortcuts import redirect
from django.urls import reverse
from django.conf import settings


class AuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        PUBLIC_URLS = [
            reverse('landing_page'),
            reverse('login'),
            reverse('signup'),
            '/static/',  # Allow
            '/media/',   # Allow
        ]

        if not request.session.get('id'):
            if not any(request.path.startswith(url) for url in PUBLIC_URLS):
                return redirect('landing_page')

        elif request.session.get('id'):
            if request.path in [reverse('landing_page'), reverse('login'), reverse('signup')]:
                return redirect('home')

        response = self.get_response(request)
        return response
