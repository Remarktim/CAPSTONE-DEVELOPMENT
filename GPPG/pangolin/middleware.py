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
            '/accounts/',
            '/auth/google/',
            '/static/',
            '/media/',
        ]

        # Check if the path is public
        current_path = request.path
        is_public_url = any(current_path.startswith(url)
                            for url in PUBLIC_URLS)

        # Get authentication status
        is_authenticated = request.session.get('user_id') is not None

        if not is_authenticated and not is_public_url:
            return redirect('landing_page')
        elif is_authenticated and current_path in [reverse('landing_page'), reverse('login'), reverse('signup')]:
            return redirect('home')

        return self.get_response(request)
