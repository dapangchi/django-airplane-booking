# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import mptt.fields
import django_autoslug.fields


class Migration(migrations.Migration):

    dependencies = [
        ('structure', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='FooterGroup',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=255, verbose_name='title')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='node',
            name='footer_group',
            field=models.ForeignKey(to='structure.FooterGroup', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='node',
            name='footer_group_order',
            field=models.PositiveSmallIntegerField(default=1, verbose_name='footer group order'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='node',
            name='parent',
            field=mptt.fields.TreeForeignKey(related_name='children', blank=True, to='structure.Node', help_text=b'If this node is second-level navigation, select its parent here.', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='node',
            name='slug',
            field=django_autoslug.fields.AutoSlugField(recursive=b'\'"\\\'parent\\\'"\'', populate_from=b'\'"(\\\'name\\\',)"\'', editable=False, use_recursive_slug=b'"\'True\'"', max_length=255, separator=b'\'"u\\\'-\\\'"\'', blank=True, unique=True, verbose_name='slug', overwrite=b'"\'False\'"'),
            preserve_default=True,
        ),
    ]
