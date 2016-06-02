from django.conf.urls import patterns, url
from .views import SendEmailView

urlpatterns = patterns('common.views',
    # url(r'^preview', 'preview', name='preview'),
    #url(r'^$', 'index', name='index'),

    url(r'^preview/(?P<appname>[-\w]+)/(?P<tname>[-\w]+)/$', 'show_template', name='show_template'),
    url(r'^preview/(?P<appname>[-\w\/]+)/', 'show_template', name='show_template'),
    url(r'^profile/', 'profile', name='profile'),
    url(r'^request/', 'offer_request', name='request'),
    url(r'^send_email/', SendEmailView.as_view(), name='request'),
    url(r'^account/', 'account', name='account'),
)
