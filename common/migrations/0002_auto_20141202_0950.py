# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='snippet',
            name='image',
            field=models.ForeignKey(verbose_name='image', blank=True, to='common.Image', null=True),
            preserve_default=True,
        ),
    ]
