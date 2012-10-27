from django.http import HttpResponse
from django.forms.models import inlineformset_factory 

from models import Album, Song
from forms import AlbumForm
from decorators import ajax_required

import pdb
import json

@ajax_required
def base(request):
    return HttpResponse("")

@ajax_required
def post_album(request, artist_id):
  return create_album(request, artist_id)

def put_album(request, artist_id, album_id):
  return create_album(request, artist_id, album_id)

def create_album(request, artist_id, album_id=None):
  if request.method != "POST":
    return HttpResponse(json.dumps({ 'error': 'Invalid http method for this uri' }))
  SongFormset = inlineformset_factory(Album, Song)
  if album_id is not None:
    album = Album.objects.get(pk=album_id)
    albumForm = AlbumForm(request.POST, request.FILES, instance=album)
    songsForm = SongFormset(request.POST, request.FILES, instance=album, prefix="form")
  else:
    albumForm = AlbumForm(request.POST, request.FILES)
    songsForm = SongFormset(request.POST, request.FILES, prefix="form")

  if songsForm.is_valid() and albumForm.is_valid():
    albumForm.save()
    songsForm.save()
    return HttpResponse(json.dumps({ 'success': 'true' }))
  else:
    errors = {}
    errors['song_errors'] = [dict(err.items()) for err in songsForm.errors]
    errors['album_errors'] = dict(albumForm.errors.items())
    resp = HttpResponse(json.dumps({ 'errors': errors }),
        mimetype="application/json")
    resp.status_code = 400
    return resp
