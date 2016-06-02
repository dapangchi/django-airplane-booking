from django.db import models


class Contact(models.Model):
    first_name = models.CharField(max_length=64, default="")
    email = models.EmailField(default="")
    message = models.CharField(max_length=2000, default="")
    date_created = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return "%s (%s)" % (self.first_name, self.email)

    def get_absolute_url(self):
        return '/about-us/contact/'
