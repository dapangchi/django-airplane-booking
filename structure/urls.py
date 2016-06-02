from django.conf.urls import patterns, url

urlpatterns = patterns('structure.views',
	url(r'^(?P<slug>[-/\w]+)/$', 'node_detail', name='node_detail'),
)
