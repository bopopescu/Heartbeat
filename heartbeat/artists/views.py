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

def put_post_album(request, artist_id, album_id):
  return create_album(request, artist_id, album_id)

def create_album(request, artist_id, album_id=None):
  pdb.set_trace()
  if request.method != "POST":
    return HttpResponse(json.dumps({ 'error': 'Invalid http method for this uri' }))
  SongFormset = inlineformset_factory(Album, Song)
  if album_id is not None:
    album = Album.objects.get(pk=album_id)
    albumForm = AlbumForm(request.POST, request.FILES, instance=album)
    songsForm = SongFormset(request.POST, request.FILES, instance=album, prefix="form")
  else:
    albumForm = AlbumForm(request.POST, request.FILES)
    songsForm = SongFormset(request.POST, request.FILES)

  if songsForm.is_valid() and albumForm.is_valid():
    albumForm.save()
    songsForm.save()
    return HttpResponse(json.dumps({ 'success': 'true' }))
  else:
    pdb.set_trace()
    errors = {}
    for error in songsForm.errors: errors = dict(errors.items() + error.items())
    resp = HttpResponse(json.dumps({ 'errors': dict(albumForm.errors.items() + errors.items()) }),
        mimetype="application/json")
    resp.status_code = 400
    return resp
