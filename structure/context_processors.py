from __future__ import absolute_import
from django.conf import settings

from common.models import Snippet
from .models import Node, FooterGroup


def navigation(request):
    root_navigation = Node.objects.root_nodes()
    main_navigation = root_navigation.filter(visible=True)
    sub_navigation = None
    for nav in root_navigation:
        if nav.get_absolute_url() in request.path:
            # remove nodes that are not visible
            sub_navigation = []
            for node in nav.get_children():
                if node.visible:
                    sub_navigation.append(node)

    return {
        'navigation': main_navigation,
        'footer': FooterGroup.objects.all(),
        'subnavigation': sub_navigation,
        'DEBUG': settings.DEBUG,
        'snippets': Snippet.objects.all(),
    }


# def second(request):
#     first = navigation(request)
#     for n in first['navigation']:
#         if n.get_absolute_url() in request.path:
#             return {'second': n.get_children().filter(visible=True)}
#     return {'second': None}
