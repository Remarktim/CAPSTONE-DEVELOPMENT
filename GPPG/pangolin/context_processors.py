from .models import *


def user_initials(request):
    user_id = request.session.get('user_id')
    if user_id:
        user = User.objects.get(id=user_id)
        initials = f"{user.first_name[0]}{user.last_name[0]}"
        name = f"{user.first_name} {user.last_name}"
        return {'user': user, 'initials': initials, 'name': name}
    return {}
