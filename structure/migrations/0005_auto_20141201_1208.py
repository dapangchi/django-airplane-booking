# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django_autoslug.fields


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0001_initial'),
        ('structure', '0004_auto_20141201_0936'),
    ]

    operations = [
        migrations.AddField(
            model_name='node',
            name='image',
            field=models.ForeignKey(verbose_name='header image', blank=True, to='common.Image', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='article',
            name='node',
            field=models.ForeignKey(to='structure.Node', help_text=b'Associate this article with a Node (Page).', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='article',
            name='order',
            field=models.PositiveSmallIntegerField(default=1, help_text=b'If you have multiple articles per one Node (Page), you can define their order here.', verbose_name='order'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='node',
            name='slug',
            field=django_autoslug.fields.AutoSlugField(recursive=b'\'"\\\'parent\\\'"\'', populate_from=b'\'"(\\\'name\\\',)"\'', editable=False, use_recursive_slug=b'"\'True\'"', max_length=255, separator=b'\'"u\\\'-\\\'"\'', blank=True, unique=True, verbose_name='slug', overwrite=b'"\'False\'"'),
            preserve_default=True,
        ),
    ]
