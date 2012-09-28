from django.conf import settings

from os.path import splitext
import pdb

def zip_file_name(album):
    return '/'.join(["artists", 
                     unicode(album.artist.name), 
                     'albums', 
                     unicode(album.title), 
                     ".zip"])

def artist_icon_name(artist_image, filename):
    return '/'.join([
                     "artists", 
                     unicode(artist_image.artist.name), 
                     'icons', 
                     unicode(filename)])
def album_cover_name(instance, filename):
  return '/'.join([
                    "artists", 
                     unicode(instance.artist.name), 
                     'albums', 
                     unicode(instance.title), 
                     unicode(filename)])

def song_file_name(instance, filename):
    return '/'.join(["artists", 
                     unicode(instance.album.artist.name), 
                     'albums', 
                     unicode(instance.album.title), 
                     (unicode(instance.name) + splitext(filename)[1])]) # ignore the filename, take the extension

def tour_icon_name(instance, filename):
    return '/'.join(["artists", 
                     unicode(instance.artist.name), 
                     'tours', 
                     unicode(instance.title), 
                     unicode(filename)])

def concert_icon_name(instance, filename):
    return '/'.join(["artists", 
                     unicode(instance.artist.name), 
                     'tours', 
                     unicode(instance.tour.title), 
                     unicode(instance.venue)])
