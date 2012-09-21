from django.conf.urls.defaults import url 
from django.core import serializers

from models import Artist, Album, Song

from tastypie import fields
from tastypie.resources import Resource, ModelResource
from tastypie.utils import trailing_slash

import pdb

class ArtistResource(ModelResource):
    """A resource for artists
    Allows for retrieving artist information,
    especially top artists for a particular user

    """
    albums = fields.ToManyField('artists.api.AlbumResource', 'album_set', full=True)
    class Meta:
        queryset = Artist.objects.all()
        include_resource_uri = False

class AlbumResource(ModelResource):
    """A resource for albums
    Can Retrieve albums, sort by hot albums, and has algorithms
    for smartly detecting what albums might be interesting based on
    certain parameters
    
    """
    artist = fields.ForeignKey(ArtistResource, 'artist')
    class Meta:
        queryset = Album.objects.all()
        resource_name = "album"
        filtering = {
          "artist": ('exact',),
        }
        
    def override_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/hot%s$" % (self._meta.resource_name, trailing_slash()),
                self.wrap_view("hot"), name="api_hot"),
            ]

    def hot(self, request, **kwargs):
        return self.create_response(request, {
                'albums': serializers.serialize("json", Album.get_top_albums(), 
                                                extras=('songs',), relations=('artist',))
                })
class SongResource(ModelResource):
  """A resource for songs
  Can retrieve individual songs or albums of songs, used to sync
  songs and individual songs with the server

  """
  class Meta:
    queryset = Song.objects.all()
    resource_name = "song"
