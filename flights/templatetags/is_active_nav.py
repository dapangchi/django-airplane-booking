import logging
from django import template

register = template.Library()
log = logging.getLogger('ascent_jet.custom')


@register.simple_tag(takes_context=True)
def is_active_nav(context, flight_id, flight):
    path = context['request'].path
    if flight:
        if ("/flights/requests/%s/" % flight_id) in str(path) or flight_id == flight.id:
            return "active"
        else:
            return ""
    else:
        return ""
