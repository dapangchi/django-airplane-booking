import sys, traceback
import logging
from django.forms import ModelForm
from captcha.fields import ReCaptchaField

from .models import Contact
from .emails import send_contact_email_to_ascent_jet

log = logging.getLogger('ascent_jet.custom')


class ContactForm(ModelForm):
    captcha = ReCaptchaField()

    class Meta:
        model = Contact
        fields = ['first_name', 'email', 'message']

    def save(self, commit=True, *args, **kwargs):
        instance = super(ContactForm, self).save()
        # send autoresponse email
        try:
            send_contact_email_to_ascent_jet(instance)
        except:
            log.warn("send_contact_email_to_ascent_jet email. Cannot send emails, error: %s" % sys.exc_info()[0])
            log.warn("Details: %s" % sys.exc_info()[1])
            log.warn("Trace: %s" % traceback.print_tb(sys.exc_info()[2]))
        return instance
