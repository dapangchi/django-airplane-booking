# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('contact', '0002_auto_20150929_0845'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contact',
            name='email',
            field=models.EmailField(default=b'', max_length=75),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='contact',
            name='first_name',
            field=models.CharField(default=b'', max_length=64),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='contact',
            name='message',
            field=models.CharField(default=b'', max_length=2000),
            preserve_default=True,
        ),
    ]
