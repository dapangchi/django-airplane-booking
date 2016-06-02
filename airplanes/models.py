from __future__ import absolute_import
from django.db import models
from django.utils.translation import ugettext_lazy as _

from common.models import Image


class AirplaneCategory(models.Model):
    title = models.CharField(_(u'title'), max_length=255)
    lead = models.TextField(_(u'lead'))
    image = models.ForeignKey(Image, verbose_name=_(u'image'))
    order = models.PositiveSmallIntegerField(_(u'order'), default=1, help_text="Define ordering of categories here. Use whole, positive numbers (1, 2, 3, ...).")
    hidden = models.BooleanField(_(u'hidden'), default=False, help_text="Use this checkbox to hide category in the frontend.")

    class Meta:
        ordering = ['order']
        verbose_name = 'airplane category'
        verbose_name_plural = 'airplane categories'

    def __unicode__(self):
        return self.title


class Airplane(models.Model):
    category = models.ForeignKey(AirplaneCategory, verbose_name=_(u'airplane category'), null=True, blank=True)
    title = models.CharField(_(u'title'), max_length=255)
    outer_image = models.ForeignKey(Image, verbose_name=_(u'outer image'), related_name='+')
    inner_image = models.ForeignKey(Image, verbose_name=_(u'inner image'), related_name='+', null=True, blank=True)
    layout_image = models.ForeignKey(Image, verbose_name=_(u'layout image'), related_name='+', null=True, blank=True)
    passenger_seating = models.CharField(_(u'passenger seating'), max_length=255, null=True, blank=True)
    luggage_capacity = models.CharField(_(u'luggage capacity'), max_length=255, null=True, blank=True)
    max_speed = models.CharField(_(u'max speed'), max_length=255, null=True, blank=True)
    max_range = models.CharField(_(u'max range'), max_length=255, null=True, blank=True)
    takeoff_distance = models.CharField(_(u'takeoff distance'), max_length=255, null=True, blank=True)
    max_altitude = models.CharField(_(u'max altitue'), max_length=255, null=True, blank=True)
    order = models.PositiveSmallIntegerField(_(u'order'), default=1, help_text="Define ordering of airplanes here. Use whole, positive numbers (1, 2, 3, ...).")

    class Meta:
        ordering = ['order']

    def __unicode__(self):
        return self.title
