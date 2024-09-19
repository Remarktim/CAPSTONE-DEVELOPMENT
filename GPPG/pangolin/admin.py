from django.contrib import admin
from .models import *

@admin.register(Incident)
class IncidentAdmin(admin.ModelAdmin):
    list_display = ("municipality", "city", "status", "description")
    search_fields = ("municipality", "city", "status")

@admin.register(Evidence)
class EvidenceAdmin(admin.ModelAdmin):
    list_display = ("incident", "evidence_type")
    search_fields = ("incident", "evidence_type")

@admin.register(IncidentReport)
class IncidentReportAdmin(admin.ModelAdmin):
    list_display = ("admin", "incident", "date_reported")
    search_fields = ("admin", "incident", "date_reported")


admin.site.register(Admin)
admin.site.register(Officer)
admin.site.register(Event)



