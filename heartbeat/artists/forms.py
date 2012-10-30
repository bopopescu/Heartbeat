from django import forms
from django.forms import ModelForm

from artists.models import Artist, Album, Tour, Song, Concert

class ArtistForm(forms.ModelForm):
  class Meta:
    model = Artist

class AlbumForm(ModelForm):
  class Meta:
    model = Album
