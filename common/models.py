from django.db import models
from django.utils.translation import ugettext_lazy as _
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFit


class Snippet(models.Model):
    title = models.CharField(_(u'title'), max_length=255)
    body = models.TextField(_(u'body'))
    link = models.CharField(_(u'link'), max_length=255, blank=True, default='')
    link_title = models.CharField(_(u'link title'), max_length=255, blank=True, default='')
    image = models.ForeignKey('Image', verbose_name=_(u'image'), null=True, blank=True)
    icon = models.CharField(_(u'icon'), max_length=255, help_text=_(u'For snippets which use icons, define css class here.'), blank=True, default='')

    class Meta:
        verbose_name = _(u'Snippet')
        verbose_name_plural = _(u'Snippets')
        ordering = ('id',)

    def __unicode__(self):
        return self.title


class Image(models.Model):
    title = models.CharField(_(u'title'), max_length=255)
    resource = models.ImageField(_(u'resource'), upload_to='images', max_length=255, help_text=_(u'Upload JPEG or PNG formats.'))
    caption = models.TextField(_(u'caption'), max_length=511, null=True, blank=True)

    thumb_400 = ImageSpecField(source='resource', processors=[ResizeToFit(400, 282)], format='JPEG', options={'quality': 90})
    thumb_325 = ImageSpecField(source='resource', processors=[ResizeToFit(325, 200)], format='JPEG', options={'quality': 90})

    class Meta:
        verbose_name = _(u'Image')
        verbose_name_plural = _(u'Images')

    def __unicode__(self):
        return self.title

    @property
    def url(self):
        return self.resource.url

    @property
    def get_thumb_400(self):
        try:
            return self.thumb_400.url
        except:
            return None

    @property
    def get_thumb_325(self):
        try:
            return self.thumb_325.url
        except:
            return None


class HomePageImage(Image):
    header = models.BooleanField(default=False,
                                 help_text="Check this box if you want image to randomly rotate with other header images. \
                                 Multiple images can have this box checked and they will all be rotated on page loads.")
    body = models.BooleanField(default=False, help_text="Check this box if you want to display image in homepage body. \
                               Body images are not rotated like header images, but only a single body image is displayed on the homepage.")
