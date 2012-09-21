from django.contrib import admin
from django.forms import ModelForm

from models import Artist, Album, Song, Concert, Tour

class SongInline(admin.TabularInline):
    model = Song
    extra = 3

class AlbumAdmin(admin.ModelAdmin):
    inlines = [SongInline]

class AlbumInline(admin.TabularInline):
    model = Album
    extra = 1

class ArtistAdmin(admin.ModelAdmin):
    inlines = [AlbumInline]

class ConcertInline(admin.TabularInline):
    model = Concert
    extra = 5
    
class TourAdmin(admin.ModelAdmin):
    inlines = [ConcertInline]
    
admin.site.register(Artist)
admin.site.register(Album, AlbumAdmin)
admin.site.register(Tour, TourAdmin)
