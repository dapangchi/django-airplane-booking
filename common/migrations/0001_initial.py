# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=255, verbose_name='title')),
                ('resource', models.ImageField(help_text='Upload JPEG or PNG formats.', upload_to=b'images', max_length=255, verbose_name='resource')),
            ],
            options={
                'verbose_name': 'Image',
                'verbose_name_plural': 'Images',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Snippet',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=255, verbose_name='title')),
                ('body', models.TextField(verbose_name='body')),
                ('link', models.CharField(default=b'', max_length=255, verbose_name='link', blank=True)),
                ('link_title', models.CharField(default=b'', max_length=255, verbose_name='link title', blank=True)),
                ('image', models.OneToOneField(null=True, blank=True, to='common.Image', verbose_name='image')),
            ],
            options={
                'ordering': ('id',),
                'verbose_name': 'Snippet',
                'verbose_name_plural': 'Snippets',
            },
            bases=(models.Model,),
        ),
    ]
