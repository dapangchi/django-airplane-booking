from __future__ import absolute_import
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.core.urlresolvers import reverse_lazy, reverse

from django_autoslug.fields import AutoSlugField
from mptt.models import MPTTModel, TreeForeignKey

from common.models import Image


class Article(models.Model):
    title = models.CharField(_(u'title'), max_length=255)
    lead = models.TextField(_(u'lead'))
    body = models.TextField(_(u'body'))
    image = models.ForeignKey(Image, verbose_name=_(u'image'), blank=True, null=True, help_text='Article image is inserted after article body text.')
    conclusion = models.TextField(_(u'conclusion'), blank=True, default='')
    node = models.ForeignKey('Node', null=True, help_text='Associate this article with a Node (Page).')
    order = models.PositiveSmallIntegerField(_(u'order'), default=1, help_text='If you have multiple articles per one Node (Page), you can define their order here.')

    def __unicode__(self):
        return self.title

    def get_absolute_url(self):
        return reverse_lazy('structure:n    ode_detail', kwargs={'slug': self.node.slug})


class Node(MPTTModel):
    name = models.CharField(_(u'name'), max_length=255)
    image = models.ForeignKey(Image, verbose_name=_(u'header image'), blank=True, null=True)
    slug = AutoSlugField(_(u'slug'), populate_from=('name',), recursive='parent', use_recursive_slug=True, overwrite=True, editable=False, max_length=255, unique=True)
    visible = models.BooleanField(_(u'visible'), default=True)
    order = models.PositiveSmallIntegerField(_(u'order'), default=1)
    parent = TreeForeignKey('self', null=True, blank=True, related_name='children', help_text='If this node is second-level navigation, select its parent here.')
    footer_group = models.ForeignKey('FooterGroup', blank=True, null=True)
    footer_group_order = models.PositiveSmallIntegerField(_(u'footer group order'), default=1)
    include_airplanes = models.BooleanField(_(u'include airplanes'), default=False, help_text='If checked, airplanes descriptions and categories will be included on the page.')

    class MPTTMeta:
        order_insertion_by = ('order',)

    class Meta:
        verbose_name = _('Node')
        verbose_name_plural = _('Nodes')
        ordering = ('order',)

    def __unicode__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('structure:node_detail', kwargs={'slug': self.slug})

    @property
    def sorted_article_set(self):
        return self.article_set.order_by('order')


class FooterGroup(models.Model):
    title = models.CharField(_(u'title'), max_length=255)

    def __unicode__(self):
        return self.title

    @property
    def sorted_node_set(self):
        return self.node_set.order_by('footer_group_order')
