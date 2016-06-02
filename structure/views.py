from __future__ import absolute_import
from django.views.generic.detail import DetailView

from airplanes.models import AirplaneCategory
from contact.forms import ContactForm
from .models import Node


class NodeDetail(DetailView):
    model = Node

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(NodeDetail, self).get_context_data(**kwargs)
        # Add in a QuerySet of airplane categories
        if self.get_object().include_airplanes:
            context['airplane_categories'] = AirplaneCategory.objects.filter(hidden=False)
        # add page title to context
        if self.object.sorted_article_set:
            try:
                context['page_title'] = self.object.sorted_article_set.all()[0].title
            except:
                pass
        # for contact page initialize form
        if self.get_object().pk == 13:
            context['form'] = ContactForm()
        return context

node_detail = NodeDetail.as_view()
