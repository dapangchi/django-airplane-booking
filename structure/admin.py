from __future__ import absolute_import

from django.contrib import admin

from mptt.admin import MPTTModelAdmin

from .models import Article, Node, FooterGroup
from .forms import ArticleForm


class ArticleAdmin(admin.ModelAdmin):
    save_on_top = True
    form = ArticleForm
    list_display = ['title', 'lead', 'node']


class NodeAdmin(MPTTModelAdmin):
    save_on_top = True
    list_display = ['name', 'order', 'slug', 'footer_group', 'footer_group_order', ]

    # return a list of fields that should be rendered in admin
    def get_fields(self, request, obj=None):
        fields = ['name', 'visible', 'order', 'parent', 'footer_group', 'footer_group_order', 'include_airplanes', ]
        # only superusers can edit header images
        superusers = ['ozren1983', 'borko', 'davor']
        if request.user.is_superuser and request.user.username in superusers:
            # insert image select field as the second field in the list
            fields.insert(1, 'image')
        return fields


class FooterGroupAdmin(admin.ModelAdmin):
    save_on_top = True

admin.site.register(Article, ArticleAdmin)
admin.site.register(Node, NodeAdmin)
admin.site.register(FooterGroup, FooterGroupAdmin)
