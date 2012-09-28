# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting model 'AdView'
        db.delete_table('artists_adview')

        # Deleting model 'Impression'
        db.delete_table('artists_impression')

        # Deleting model 'AdHistory'
        db.delete_table('artists_adhistory')


    def backwards(self, orm):
        # Adding model 'AdView'
        db.create_table('artists_adview', (
            ('profile', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['users.Profile'])),
            ('finished', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('time', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('artist', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['artists.Artist'])),
            ('song', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['artists.Song'])),
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('timeSpentWatching', self.gf('django.db.models.fields.PositiveIntegerField')()),
        ))
        db.send_create_signal('artists', ['AdView'])

        # Adding model 'Impression'
        db.create_table('artists_impression', (
            ('profile', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['users.Profile'])),
            ('artist', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['artists.Artist'])),
            ('page', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('time', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
        ))
        db.send_create_signal('artists', ['Impression'])

        # Adding model 'AdHistory'
        db.create_table('artists_adhistory', (
            ('closed', self.gf('django.db.models.fields.IntegerField')(default=0)),
            ('artist', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['artists.Artist'])),
            ('impressions', self.gf('django.db.models.fields.PositiveIntegerField')()),
            ('month', self.gf('django.db.models.fields.IntegerField')()),
            ('year', self.gf('django.db.models.fields.IntegerField')()),
            ('clicks', self.gf('django.db.models.fields.PositiveIntegerField')()),
            ('watches', self.gf('django.db.models.fields.PositiveIntegerField')()),
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
        ))
        db.send_create_signal('artists', ['AdHistory'])


    models = {
        'artists.adspreferences': {
            'Meta': {'object_name': 'AdsPreferences'},
            'artist': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['artists.Artist']", 'unique': 'True'}),
            'banner_ad_count': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'video_download': ('django.db.models.fields.IntegerField', [], {'default': '0'})
        },
        'artists.album': {
            'Meta': {'object_name': 'Album'},
            'artist': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['artists.Artist']"}),
            'cover': ('django.db.models.fields.files.FileField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'release_date': ('django.db.models.fields.DateField', [], {}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'to_zip': ('django.db.models.fields.BooleanField', [], {'default': 'False'})
        },
        'artists.artist': {
            'Meta': {'object_name': 'Artist'},
            'bio': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '50'}),
            'profile': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['users.Profile']", 'unique': 'True'})
        },
        'artists.concert': {
            'Meta': {'object_name': 'Concert'},
            'address': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'artist': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['artists.Artist']"}),
            'city': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'country': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'date': ('django.db.models.fields.DateField', [], {}),
            'icon': ('django.db.models.fields.files.FileField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '3'}),
            'time': ('django.db.models.fields.TimeField', [], {}),
            'tour': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['artists.Tour']"}),
            'venue': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'artists.song': {
            'Meta': {'object_name': 'Song'},
            'album': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['artists.Album']"}),
            'download_link': ('django.db.models.fields.files.FileField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'track_num': ('django.db.models.fields.IntegerField', [], {})
        },
        'artists.tour': {
            'Meta': {'object_name': 'Tour'},
            'album': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['artists.Album']", 'blank': 'True'}),
            'artist': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['artists.Artist']"}),
            'icon': ('django.db.models.fields.files.FileField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '150'})
        },
        'auth.group': {
            'Meta': {'object_name': 'Group'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        'auth.permission': {
            'Meta': {'ordering': "('content_type__app_label', 'content_type__model', 'codename')", 'unique_together': "(('content_type', 'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['contenttypes.ContentType']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Group']", 'symmetrical': 'False', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        'users.profile': {
            'Meta': {'object_name': 'Profile'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'invites': ('django.db.models.fields.IntegerField', [], {}),
            'user': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['auth.User']", 'unique': 'True'})
        }
    }

    complete_apps = ['artists']