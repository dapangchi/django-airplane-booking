# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django_autoslug.fields


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0001_initial'),
        ('structure', '0002_auto_20141128_1629'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='conclusion',
            field=models.TextField(default=b'', help_text=b'Conclusion is inserted below article main image and above footer.', verbose_name='conclusion', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='article',
            name='image',
            field=models.ForeignKey(blank=True, to='common.Image', help_text=b'Article image is inserted after article body text.', null=True, verbose_name='image'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='node',
            name='slug',
            field=django_autoslug.fields.AutoSlugField(recursive=b'\'"\\\'parent\\\'"\'', populate_from=b'\'"(\\\'name\\\',)"\'', editable=False, use_recursive_slug=b'"\'True\'"', max_length=255, separator=b'\'"u\\\'-\\\'"\'', blank=True, unique=True, verbose_name='slug', overwrite=b'"\'False\'"'),
            preserve_default=True,
        ),
    ]
