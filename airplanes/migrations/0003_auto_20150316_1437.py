# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('airplanes', '0002_auto_20150312_0943'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='airplane',
            options={'ordering': ['order']},
        ),
        migrations.AlterModelOptions(
            name='airplanecategory',
            options={'ordering': ['order'], 'verbose_name': 'airplane category', 'verbose_name_plural': 'airplane categories'},
        ),
        migrations.AddField(
            model_name='airplane',
            name='order',
            field=models.PositiveSmallIntegerField(default=1, help_text=b'Define ordering of airplanes here. Use whole, positive numbers (1, 2, 3, ...).', verbose_name='order'),
            preserve_default=True,
        ),
    ]
