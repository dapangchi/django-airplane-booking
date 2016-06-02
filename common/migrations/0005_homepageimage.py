# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0004_image_caption'),
    ]

    operations = [
        migrations.CreateModel(
            name='HomePageImage',
            fields=[
                ('image_ptr', models.OneToOneField(parent_link=True, auto_created=True, primary_key=True, serialize=False, to='common.Image')),
            ],
            options={
            },
            bases=('common.image',),
        ),
    ]
