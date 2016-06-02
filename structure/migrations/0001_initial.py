# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django_autoslug.fields
import mptt.fields


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Article',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=255, verbose_name='title')),
                ('lead', models.TextField(verbose_name='lead')),
                ('body', models.TextField(verbose_name='body')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Node',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255, verbose_name='name')),
                ('slug', django_autoslug.fields.AutoSlugField(recursive=b'"\'parent\'"', populate_from=b'"(\'name\',)"', editable=False, use_recursive_slug=b"'True'", max_length=255, separator=b'"u\'-\'"', blank=True, unique=True, verbose_name='slug', overwrite=b"'False'")),
                ('visible', models.BooleanField(default=True, verbose_name='visible')),
                ('order', models.PositiveSmallIntegerField(default=1, verbose_name='order')),
                ('lft', models.PositiveIntegerField(editable=False, db_index=True)),
                ('rght', models.PositiveIntegerField(editable=False, db_index=True)),
                ('tree_id', models.PositiveIntegerField(editable=False, db_index=True)),
                ('level', models.PositiveIntegerField(editable=False, db_index=True)),
                ('parent', mptt.fields.TreeForeignKey(related_name='children', blank=True, to='structure.Node', help_text=b'If this node is header navigation sub-element, select its parent here.', null=True)),
            ],
            options={
                'ordering': ('order',),
                'verbose_name': 'Node',
                'verbose_name_plural': 'Nodes',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='article',
            name='node',
            field=models.ForeignKey(to='structure.Node', null=True),
            preserve_default=True,
        ),
    ]
