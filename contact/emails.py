from django.core.mail import EmailMultiAlternatives
from django.conf import settings


def send_contact_email_to_ascent_jet(contact):

    subject = u'New contact form submitted by %s' % contact.email
    to = settings.DEFAULT_TO_EMAIL
    from_email = '%s <%s>' % (contact.first_name, contact.email)
    message = contact.message
    text_content = """%s""" % (message)

    msg = EmailMultiAlternatives(subject, text_content, from_email=from_email, to=[to])
    msg.send()
