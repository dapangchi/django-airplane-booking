from __future__ import absolute_import

from django.contrib import admin

from .models import AirplaneCategory, Airplane
from .forms import AirplaneCategoryForm


class AirplaneCategoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'order', 'hidden',)
    form = AirplaneCategoryForm


admin.site.register(AirplaneCategory, AirplaneCategoryAdmin)
admin.site.register(Airplane)
