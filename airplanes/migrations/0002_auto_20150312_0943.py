# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('airplanes', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='airplanecategory',
            name='hidden',
            field=models.BooleanField(default=False, help_text=b'Use this checkbox to hide category in the frontend.', verbose_name='hidden'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='airplanecategory',
            name='order',
            field=models.PositiveSmallIntegerField(default=1, help_text=b'Define ordering of categories here. Use whole, positive numbers (1, 2, 3, ...).', verbose_name='order'),
            preserve_default=True,
        ),
    ]
