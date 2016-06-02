from django.conf.urls import patterns, url
from flights.views import generate_pdf

urlpatterns = patterns(
    'flights.views',
    # url(r'^$', 'flights', name='flights'),
    # url(r'^booked/$', 'flights_booked', name='flights_booked'),
    # url(r'^requests/$', 'flights_requests', name='flights_requests'),
    url(r'^requests/$', 'flight_request', name='flight_request'),
    url(r'^requests/(?P<id>\d+)/$', 'flight_request', name='flight_request'),
    url(r'^booking/', 'booking_request', name='booking'),

    url(r'^invoice/(?P<id>\d+)/$', generate_pdf, name='generate_pdf'),

    url(r'^success/', 'offer_status', {'status': 'success'}),
    url(r'^error/', 'offer_status', {'status': 'error'}),
    url(r'^cancel/', 'offer_status', {'status': 'cancel'}),
)
