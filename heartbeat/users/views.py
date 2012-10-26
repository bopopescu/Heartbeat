from django.contrib.auth import login, authenticate
from django.http import HttpResponse
from django.db import IntegrityError

from decorators import ajax_required
from forms import UserForm, ProfileForm, ArtistForm

import json
import pdb

@ajax_required
def base(request):
  return HttpResponse("<div id='login_form'></div>")

def register(request):
  if request.method == "POST":
    data = json.loads(request.raw_post_data)
    uForm = UserForm(data = data)
    pForm = ProfileForm(data = data)
    aForm = None 
    if data['artist']:
      aForm = ArtistForm(data = data)
    if uForm.is_valid() and pForm.is_valid() and (aForm == None or aForm.is_valid()):
      user = uForm.save()
      user.save()
      profile = pForm.save(commit = False)
      profile.user = user
      if not profile.invites:
        profile.invites = 0
      profile.save()
      if aForm:
        artist = aForm.save(commit = False)
        artist.profile = profile
        artist.save()
      user = authenticate(username = data['username'],
                          password = data['password1'])
      login(request, user)
      resp = HttpResponse(json.dumps({'success': 'true'}), mimetype="application/json")
      resp.status_code = 201
      return resp 
    else:
      error = dict(uForm.errors.items()
                  + pForm.errors.items())
  else:
    error = "The request must be a POST"
  resp = HttpResponse(json.dumps({'error': error}), mimetype="applcation/json")
  resp.status_code = 400
  return resp
