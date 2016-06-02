# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0003_snippet_icon'),
    ]

    operations = [
        migrations.AddField(
            model_name='image',
            name='caption',
            field=models.TextField(max_length=511, null=True, verbose_name='caption', blank=True),
            preserve_default=True,
        ),
    ]
