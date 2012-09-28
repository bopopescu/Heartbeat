# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Impression'
        db.create_table('ads_impression', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('artist', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['artists.Artist'])),
            ('profile', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['users.Profile'])),
            ('page', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('time', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
        ))
        db.send_create_signal('ads', ['Impression'])

        # Adding model 'AdView'
        db.create_table('ads_adview', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('artist', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['artists.Artist'])),
            ('profile', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['users.Profile'])),
            ('song', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['artists.Song'])),
            ('time', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('timeSpentWatching', self.gf('django.db.models.fields.PositiveIntegerField')()),
            ('finished', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal('ads', ['AdView'])

        # Adding model 'AdHistory'
        db.create_table('ads_adhistory', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('artist', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['artists.Artist'])),
            ('year', self.gf('django.db.models.fields.IntegerField')()),
            ('month', self.gf('django.db.models.fields.IntegerField')()),
            ('clicks', self.gf('django.db.models.fields.PositiveIntegerField')()),
            ('watches', self.gf('django.db.models.fields.PositiveIntegerField')()),
            ('impressions', self.gf('django.db.models.fields.PositiveIntegerField')()),
            ('closed', self.gf('django.db.models.fields.IntegerField')(default=0)),
        ))
        db.send_create_signal('ads', ['AdHistory'])


    def backwards(self, orm):
        # Deleting model 'Impression'
        db.delete_table('ads_impression')

        # Deleting model 'AdView'
        db.delete_table('ads_adview')

        # Deleting model 'AdHistory'
        db.delete_table('ads_adhistory')


    models = {
        'ads.adhistory': {
            'Meta': {'object_name': 'AdHistory'},
            'artist': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['artists.Artist']"}),
            'clicks': ('django.db.models.fields.PositiveIntegerField', [], {}),
            'closed': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'impressions': ('django.db.models.fields.PositiveIntegerField', [], {}),
            'month': ('django.db.models.fields.IntegerField', [], {}),
            'watches': ('django.db.models.fields.PositiveIntegerField', [], {}),
            'year': ('django.db.models.fields.IntegerField', [], {})
        },
        'ads.adview': {
            'Meta': {'object_name': 'AdView'},
            'artist': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['artists.Artist']"}),
            'finished': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'profile': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['users.Profile']"}),
            'song': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['artists.Song']"}),
            'time': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'timeSpentWatching': ('django.db.models.fields.PositiveIntegerField', [], {})
        },
        'ads.impression': {
            'Meta': {'object_name': 'Impression'},
            'artist': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['artists.Artist']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'page': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'profile': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['users.Profile']"}),
            'time': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'})
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
        'artists.song': {
            'Meta': {'object_name': 'Song'},
            'album': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['artists.Album']"}),
            'download_link': ('django.db.models.fields.files.FileField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'track_num': ('django.db.models.fields.IntegerField', [], {})
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

    complete_apps = ['ads']