from __future__ import absolute_import
from django import forms
from tinymce.widgets import TinyMCE

from .models import AirplaneCategory


class AirplaneCategoryForm(forms.ModelForm):
    lead = forms.CharField(widget=TinyMCE(mce_attrs={'height': '150px'}))

    class Meta:
        model = AirplaneCategory
        exclude = ['id']
