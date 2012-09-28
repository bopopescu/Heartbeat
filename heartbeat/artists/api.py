from django.conf.urls.defaults import url 
from django.core import serializers

from models import Artist, ArtistImage, Album, Song

from tastypie import fields
from tastypie.resources import Resource, ModelResource
from tastypie.utils import trailing_slash

import os
import pdb

class ArtistDetailsResource(ModelResource):
    """A resource for artists
    Allows for retrieving artist information,
    especially top artists for a particular user

    """
    albums = fields.ToManyField('artists.api.AlbumResource', 'album_set', full=True)
    images = fields.ToManyField('artists.api.ArtistImageResource', 'artistimage_set', full=True)
    class Meta:
        resource_name = 'artist_details'
        queryset = Artist.objects.all()
        include_resource_uri = False
        allowed_methods = ['get']

class ArtistResource(ModelResource):
    class Meta:
        resource_name = 'artist'
        queryset = Artist.objects.all()
        include_resource_uri = False
        allowed_methods = ['get']

class HotAlbumResource(ModelResource):
    artist = fields.ForeignKey(ArtistResource, 'artist', full = True)
    songs = fields.ToManyField('artists.api.SongResource', 'song_set', full=True)
    class Meta:
        queryset = Album.get_top_albums()
        resource_name = 'hot_albums'
        allowed_methods = ['get']
        resource_name = 'hot_albums'

class AlbumResource(ModelResource):
    """A resource for albums
    Can Retrieve albums, sort by hot albums, and has algorithms
    for smartly detecting what albums might be interesting based on
    certain parameters
    
    """
    artist = fields.ForeignKey(ArtistResource, 'artist')
    songs = fields.ToManyField('artists.api.SongResource', 'song_set', full=True)
    class Meta:
        queryset = Album.objects.all()
        resource_name = "album"
        filtering = {
          "artist": ('exact',),
        }
        
class SongResource(ModelResource):
  """A resource for songs
  Can retrieve individual songs or albums of songs, used to sync
  songs and individual songs with the server

  """
  class Meta:
    queryset = Song.objects.all()
    resource_name = "song"

class ArtistImageResource(ModelResource):
    class Meta:
        queryset = ArtistImage.objects.all()
        resource_name = "artist_image"
