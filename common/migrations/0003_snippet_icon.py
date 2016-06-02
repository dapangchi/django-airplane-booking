# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0002_auto_20141202_0950'),
    ]

    operations = [
        migrations.AddField(
            model_name='snippet',
            name='icon',
            field=models.CharField(default=b'', help_text='For snippets which use icons, define css class here.', max_length=255, verbose_name='icon', blank=True),
            preserve_default=True,
        ),
    ]
