# Generated by Django 2.2.2 on 2019-06-29 18:25

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Meetapp', '0002_meeting_meeting_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='comments', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='comment',
            name='meeting',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='comments', to='Meetapp.Meeting'),
        ),
        migrations.AlterField(
            model_name='meeting',
            name='admin',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='meeting', to=settings.AUTH_USER_MODEL),
        ),
    ]
