from django.core import serializers
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Count
from django.forms.models import model_to_dict

from os.path import splitext

# from users.models import Download
import json
import re
import paths
import pdb

YES=1
NO=0

ZERO=0
ONE=1
TWO=2

class Artist(models.Model):
    """An Artist
    An artist is like a user, but has an artist name in addition to their username,
    and a bio, and pictures, etc.

    """
    profile = models.OneToOneField('users.Profile', editable=False)
    name = models.CharField(max_length=50, unique=True)
    bio = models.TextField(blank=True)

    def __unicode__(self):
        return unicode(self.name)

class Album(models.Model):
    """An album
    An artist's album. It keeps track of its title, cover art, release date
    and whether it has to be zipped if someone downloads it -- we will only
    zip popular albums and then zip others on demand to save disk space.

    """
    artist = models.ForeignKey(Artist)
    title = models.CharField(max_length=100)
    cover = models.FileField(upload_to=paths.album_cover_name)
    release_date = models.DateField()
    to_zip = models.BooleanField(default=False) # whether we need to zip it
    def __unicode__(self):
        return unicode(self.title) + " by " + unicode(self.artist)

    def zip(self):
        zf = zipfile.ZipFile(zip_file_name, mode="w")
        try:
            [zf.write(song.download_link) for song in self.song_set.all()]
        finally:
            zf.close()
        return zf

    @staticmethod
    def get_top_albums():
      albums = Album.objects.annotate(num_downloads=Count('download')) \
            .order_by('num_downloads')[:5]
      for album in albums:
        album.songs = serializers.serialize("json", album.song_set.all())
      return albums

class Song(models.Model):
    """A Song
    A song in an album. Keeps track of its album, song name, download link 
    and track number

    """
    album = models.ForeignKey(Album)
    name = models.CharField(max_length=100)
    track_num = models.IntegerField()
    download_link = models.FileField(upload_to=paths.song_file_name)
    
    def __unicode__(self):
        return unicode(self.name) + " in " + unicode(self.album)
    def delete(self, *args, **kwargs):
        self.download_link.delete(save=False) # delete the file
        super(Song, self).delete(*args, **kwargs)

class AdsPreferences(models.Model):
    """An Artist's ad preferences
    An artist can make users watch an ad before downloading an album or song,
    and include banner ads to make more money.
    
    """
    artist = models.OneToOneField(Artist)
    WATCH_AD = (
        (NO, 'No'),
        (YES, 'Yes'),
        )
    BANNER_ADS = (
        (ZERO, 'zero'),
        (ONE, 'one'),
        (TWO, 'two'),
        )
    video_download = models.IntegerField(default=0, choices=WATCH_AD)
    banner_ad_count = models.IntegerField(default=0, choices=BANNER_ADS)

class Impression(models.Model):
    """An ad Impression
    Stores the profile that watched the ad and the artist they watched if for.
    Also keeps track of the page that the impression was on so artists can
    see which pages are hot.

    """
    artist = models.ForeignKey(Artist)
    profile = models.ForeignKey('users.Profile')
    page = models.CharField(max_length=100)
    time = models.DateTimeField(auto_now_add=True)

    
class AdView(models.Model):
    """An Ad Video Watch
    Stores information about the user that watched a video ad before downloading
    an ad. Also keeps track of whether the ad video dissuaded them from downloading
    
    """
    artist = models.ForeignKey(Artist)
    profile = models.ForeignKey('users.Profile')
    song = models.ForeignKey(Song)
    time = models.DateTimeField(auto_now_add=True)
    timeSpentWatching = models.PositiveIntegerField()
    finished = models.BooleanField()

class AdHistory(models.Model):
    """One artists ad history
    Ad history is a on a per day basis. 

    """
    def valid_year(value):
        if value < 2000 or value > 3000:
            raise ValidationError(u'%s is not a valid year ' % value)
    def valid_month(month):
        if month < 1 or month > 12:
            raise ValidationError(u'%s is not a valid month ' % day)
    artist = models.ForeignKey(Artist)
    year = models.IntegerField(validators=[valid_year])
    month = models.IntegerField(validators=[valid_month])
    clicks = models.PositiveIntegerField()
    watches = models.PositiveIntegerField()
    impressions = models.PositiveIntegerField()
    CLOSED = (
        (NO, 'No'),
        (YES, 'Yes'),
        )
    
    closed = models.IntegerField(default=0, choices = CLOSED)

class Tour(models.Model):
    """An Artist's tour
    A tour. I can optionally be associated with an album

    """
    artist = models.ForeignKey(Artist)
    album = models.ForeignKey(Album, blank=True)
    title = models.CharField(max_length=150)
    icon = models.FileField(upload_to=paths.tour_icon_name)
    def __unicode__(self):
        return unicode(self.title)

class Concert(models.Model):
    """A Concert
    A concert, associated with a specific tour, artist,
    at a specific location

    """
    artist = models.ForeignKey(Artist)
    tour = models.ForeignKey(Tour)
    venue = models.CharField(max_length=50)
    address = models.CharField(max_length=100)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=3)
    country = models.CharField(max_length=50)
    icon = models.FileField(upload_to=paths.concert_icon_name)
    date = models.DateField()
    time = models.TimeField()
    def __unicode__(self):
        return self.venue
