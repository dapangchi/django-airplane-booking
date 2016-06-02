from django.views.generic.edit import CreateView
from django.contrib import messages
from django.template.response import TemplateResponse

from structure.models import Node
from .models import Contact
from .forms import ContactForm


class ContactCreate(CreateView):
    model = Contact
    form_class = ContactForm
    success_url = '/about-us/contact/'

    def form_valid(self, form):
        # This method is called when valid form data has been POSTed.
        print "valid form!"
        messages.success(self.request, "Your form has been submitted. We'll respond to you shortly.")
        return super(ContactCreate, self).form_valid(form)

    def form_invalid(self, form):
        print "invalid form!"
        response = super(ContactCreate, self).form_invalid(form)
        return TemplateResponse(self.request, 'structure/node_detail.html', {'form': form, 'node': Node.objects.get(pk=13)})

contact_add = ContactCreate.as_view()
