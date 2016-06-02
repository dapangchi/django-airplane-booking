from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static

from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = patterns('',
    url(r'^grappelli/', include('grappelli.urls')),
    url(r'^admin/', include(admin.site.urls)),
    (r'^tinymce/', include('tinymce.urls')),
)

urlpatterns += patterns('',
    url(r'^$', 'common.views.index', name='index'),
    url(r'^about-us/contact/add/$', 'contact.views.contact_add', name='contact_add'),
    # override get-a-quote url (don't display Node details, but redirect to flights view)
    url(r'^get-a-quote/$', 'flights.views.get_a_qoute', name='get_a_qoute'),
    url(r'^', include('common.urls')),
    url(r'^common/', include('common.urls', namespace="common", app_name="common")),
    url(r'^flights/', include('flights.urls', namespace='flights', app_name='flights')),
    url(r'^', include('structure.urls', namespace='structure', app_name='structure')),
)

urlpatterns += staticfiles_urlpatterns() + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
