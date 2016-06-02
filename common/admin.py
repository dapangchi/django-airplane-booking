from __future__ import absolute_import

from django.contrib import admin
from imagekit.admin import AdminThumbnail

from .models import Snippet, Image, HomePageImage


class SnippetAdmin(admin.ModelAdmin):
    list_display = ['title', 'body', 'link', 'link_title']


class ImageAdmin(admin.ModelAdmin):
    list_display = ['title', 'admin_thumbnail']
    admin_thumbnail = AdminThumbnail(image_field='thumb_325')


class HomePageImageAdmin(ImageAdmin):
    list_display = ['title', 'admin_thumbnail', 'header', 'body']
    fields = ['title', 'resource', 'header', 'body']

admin.site.register(Snippet, SnippetAdmin)
admin.site.register(Image, ImageAdmin)
admin.site.register(HomePageImage, HomePageImageAdmin)
