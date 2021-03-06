# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Artist'
        db.create_table('artists_artist', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('profile', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['users.Profile'], unique=True)),
            ('name', self.gf('django.db.models.fields.CharField')(unique=True, max_length=50)),
            ('bio', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('artists', ['Artist'])

        # Adding model 'ArtistImage'
        db.create_table('artists_artistimage', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('artist', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['artists.Artist'])),
            ('image', self.gf('django.db.models.fields.files.ImageField')(max_length=100)),
        ))
        db.send_create_signal('artists', ['ArtistImage'])

        # Adding model 'Album'
        db.create_table('artists_album', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('artist', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['artists.Artist'])),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('cover', self.gf('django.db.models.fields.files.ImageField')(max_length=100)),
            ('release_date', self.gf('django.db.models.fields.DateField')()),
            ('to_zip', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal('artists', ['Album'])

        # Adding model 'Song'
        db.create_table('artists_song', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('album', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['artists.Album'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('track_num', self.gf('django.db.models.fields.IntegerField')()),
            ('download_link', self.gf('django.db.models.fields.files.FileField')(max_length=100)),
        ))
        db.send_create_signal('artists', ['Song'])

        # Adding model 'AdsPreferences'
        db.create_table('artists_adspreferences', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('artist', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['artists.Artist'], unique=True)),
            ('video_download', self.gf('django.db.models.fields.IntegerField')(default=0)),
            ('banner_ad_count', self.gf('django.db.models.fields.IntegerField')(default=0)),
        ))
        db.send_create_signal('artists', ['AdsPreferences'])

        # Adding model 'Tour'
        db.create_table('artists_tour', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('artist', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['artists.Artist'])),
            ('album', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['artists.Album'], blank=True)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=150)),
            ('icon', self.gf('django.db.models.fields.files.ImageField')(max_length=100)),
        ))
        db.send_create_signal('artists', ['Tour'])

        # Adding model 'Concert'
        db.create_table('artists_concert', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('artist', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['artists.Artist'])),
            ('tour', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['artists.Tour'])),
            ('venue', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('address', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('city', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('state', self.gf('django.db.models.fields.CharField')(max_length=3)),
            ('country', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('icon', self.gf('django.db.models.fields.files.ImageField')(max_length=100)),
            ('date', self.gf('django.db.models.fields.DateField')()),
            ('time', self.gf('django.db.models.fields.TimeField')()),
        ))
        db.send_create_signal('artists', ['Concert'])

        # Adding model 'Download'
        db.create_table('artists_download', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('profile', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['users.Profile'])),
            ('album', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['artists.Album'])),
            ('song', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['artists.Song'])),
            ('time', self.gf('django.db.models.fields.DateTimeField')()),
        ))
        db.send_create_signal('artists', ['Download'])


    def backwards(self, orm):
        # Deleting model 'Artist'
        db.delete_table('artists_artist')

        # Deleting model 'ArtistImage'
        db.delete_table('artists_artistimage')

        # Deleting model 'Album'
        db.delete_table('artists_album')

        # Deleting model 'Song'
        db.delete_table('artists_song')

        # Deleting model 'AdsPreferences'
        db.delete_table('artists_adspreferences')

        # Deleting model 'Tour'
        db.delete_table('artists_tour')

        # Deleting model 'Concert'
        db.delete_table('artists_concert')

        # Deleting model 'Download'
        db.delete_table('artists_download')


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
            'cover': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
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
        'artists.artistimage': {
            'Meta': {'object_name': 'ArtistImage'},
            'artist': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['artists.Artist']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'})
        },
        'artists.concert': {
            'Meta': {'object_name': 'Concert'},
            'address': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'artist': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['artists.Artist']"}),
            'city': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'country': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'date': ('django.db.models.fields.DateField', [], {}),
            'icon': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '3'}),
            'time': ('django.db.models.fields.TimeField', [], {}),
            'tour': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['artists.Tour']"}),
            'venue': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'artists.download': {
            'Meta': {'object_name': 'Download'},
            'album': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['artists.Album']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'profile': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['users.Profile']"}),
            'song': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['artists.Song']"}),
            'time': ('django.db.models.fields.DateTimeField', [], {})
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
            'icon': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
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