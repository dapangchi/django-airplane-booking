from __future__ import absolute_import

from django import forms
from tinymce.widgets import TinyMCE

from .models import Article


class ArticleForm(forms.ModelForm):
    body = forms.CharField(widget=TinyMCE)
    # override TinyMCE settings from settings.py with mce_attrs. Also, when overriding fields, you have to specify options like required and help text again.
    conclusion = forms.CharField(widget=TinyMCE(mce_attrs={'height': '150px'}), help_text='Conclusion is inserted below article main image and above footer.', required=False)

    class Meta:
        model = Article
        widgets = {
            # get normal size Text area, instead of default large one for Artice lead
            'lead': forms.Textarea,
        }
        exclude = ['id']
