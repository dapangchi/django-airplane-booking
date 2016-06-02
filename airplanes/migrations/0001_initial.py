# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0004_image_caption'),
    ]

    operations = [
        migrations.CreateModel(
            name='Airplane',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=255, verbose_name='title')),
                ('passenger_seating', models.CharField(max_length=255, null=True, verbose_name='passenger seating', blank=True)),
                ('luggage_capacity', models.CharField(max_length=255, null=True, verbose_name='luggage capacity', blank=True)),
                ('max_speed', models.CharField(max_length=255, null=True, verbose_name='max speed', blank=True)),
                ('max_range', models.CharField(max_length=255, null=True, verbose_name='max range', blank=True)),
                ('takeoff_distance', models.CharField(max_length=255, null=True, verbose_name='takeoff distance', blank=True)),
                ('max_altitude', models.CharField(max_length=255, null=True, verbose_name='max altitue', blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='AirplaneCategory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=255, verbose_name='title')),
                ('lead', models.TextField(verbose_name='lead')),
                ('image', models.ForeignKey(verbose_name='image', to='common.Image')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='airplane',
            name='category',
            field=models.ForeignKey(verbose_name='airplane category', blank=True, to='airplanes.AirplaneCategory', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='airplane',
            name='inner_image',
            field=models.ForeignKey(related_name='+', verbose_name='inner image', blank=True, to='common.Image', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='airplane',
            name='layout_image',
            field=models.ForeignKey(related_name='+', verbose_name='layout image', blank=True, to='common.Image', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='airplane',
            name='outer_image',
            field=models.ForeignKey(related_name='+', verbose_name='outer image', to='common.Image'),
            preserve_default=True,
        ),
    ]
