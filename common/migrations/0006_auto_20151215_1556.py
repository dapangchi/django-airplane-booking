# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0005_homepageimage'),
    ]

    operations = [
        migrations.AddField(
            model_name='homepageimage',
            name='body',
            field=models.BooleanField(default=False, help_text=b'Check this box if you want to display image in homepage body.                                Body images are not rotated like header images, but only a single body image is displayed on the homepage.'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='homepageimage',
            name='header',
            field=models.BooleanField(default=False, help_text=b'Check this box if you want image to randomly rotate with other header images.                                  Multiple images can have this box checked and they will all be rotated on page loads.'),
            preserve_default=True,
        ),
    ]
