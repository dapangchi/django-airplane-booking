# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django_autoslug.fields


class Migration(migrations.Migration):

    dependencies = [
        ('structure', '0013_auto_20150109_1511'),
    ]

    operations = [
        migrations.AddField(
            model_name='node',
            name='include_airplanes',
            field=models.BooleanField(default=False, help_text=b'If checked, airplanes descriptions and categories will be included on the page.', verbose_name='include airplanes'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='node',
            name='slug',
            field=django_autoslug.fields.AutoSlugField(recursive=b'\'"\\\'parent\\\'"\'', populate_from=b'\'"(\\\'name\\\',)"\'', editable=False, use_recursive_slug=b'"\'True\'"', max_length=255, separator=b'\'"u\\\'-\\\'"\'', blank=True, unique=True, verbose_name='slug', overwrite=b'"\'False\'"'),
            preserve_default=True,
        ),
    ]
