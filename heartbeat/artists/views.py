from django.conf import settings
from django.http import HttpResponse
from django.forms.models import inlineformset_factory 
from django.shortcuts import render_to_response
from django.template import RequestContext

from models import Album, Song
from forms import AlbumForm
from decorators import ajax_required

import stripe

import pdb
import json

def splash(request):
  if request.user.is_authenticated():
    return render_to_response("base.html")
  return render_to_response("splash.html", context=RequestContext(request))

@ajax_required
def base(request):
    return HttpResponse("")

def donate(request, artist_id):
  if not request.is_ajax() and request.method == "GET":
    return render_to_response("base.html")
  if request.method == "POST":
    amount = int(100*float(request.POST['donation']))
    stripe.api_key = settings.STRIPE_API_KEY
    token = request.POST['stripeToken']
    charge = stripe.Charge.create(
        amount=amount,
        currency="usd",
        card=token,
        description=request.user.id
    )
    pass

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
