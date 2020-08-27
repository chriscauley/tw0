# Generated by Django 3.1 on 2020-08-27 20:34

from django.db import migrations, models
import unrest.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Board',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('data_hash', models.BigIntegerField()),
                ('data', models.JSONField(default=dict)),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model, unrest.models.JsonMixin),
        ),
        migrations.CreateModel(
            name='BossSet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('data_hash', models.BigIntegerField()),
                ('data', models.JSONField(default=dict)),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model, unrest.models.JsonMixin),
        ),
        migrations.CreateModel(
            name='CompositeSprite',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('data_hash', models.BigIntegerField()),
                ('data', models.JSONField(default=dict)),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model, unrest.models.JsonMixin),
        ),
        migrations.CreateModel(
            name='Level',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('data_hash', models.BigIntegerField()),
                ('data', models.JSONField(default=dict)),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model, unrest.models.JsonMixin),
        ),
        migrations.CreateModel(
            name='MookSet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('data_hash', models.BigIntegerField()),
                ('data', models.JSONField(default=dict)),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model, unrest.models.JsonMixin),
        ),
        migrations.CreateModel(
            name='Sheet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('data_hash', models.BigIntegerField()),
                ('data', models.JSONField(default=dict)),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model, unrest.models.JsonMixin),
        ),
        migrations.CreateModel(
            name='Sprite',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('data_hash', models.BigIntegerField()),
                ('data', models.JSONField(default=dict)),
                ('stored', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model, unrest.models.JsonMixin),
        ),
    ]
