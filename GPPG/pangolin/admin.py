from django.contrib import admin
from .models import *

admin.site.register(Incident)
admin.site.register(IncidentReport)
admin.site.register(Evidence)
admin.site.register(Admin)
admin.site.register(Officer)
admin.site.register(Event)

