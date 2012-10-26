from django import forms
from django.forms import ModelForm

from artists.models import Album, Tour, Song, Concert

class AlbumForm(ModelForm):
  class Meta:
    model = Album
