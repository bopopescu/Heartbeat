from django.contrib.auth.models import User
from django.db import models

from artists.models import Artist, Song

YES=1
NO=0

class Impression(models.Model):
    """An ad Impression
    Stores the profile that watched the ad and the artist they watched if for.
    Also keeps track of the page that the impression was on so artists can
    see which pages are hot.

    """
    artist = models.ForeignKey(Artist)
    profile = models.ForeignKey(User)
    page = models.CharField(max_length=100)
    time = models.DateTimeField(auto_now_add=True)


class AdView(models.Model):
    """An Ad Video Watch
    Stores information about the user that watched a video ad before downloading
    an ad. Also keeps track of whether the ad video dissuaded them from downloading
    
    """
    artist = models.ForeignKey(Artist)
    profile = models.ForeignKey(User)
    song = models.ForeignKey(Song)
    time = models.DateTimeField(auto_now_add=True)
    timeSpentWatching = models.PositiveIntegerField()
    finished = models.BooleanField()

class AdHistory(models.Model):
    """One artists ad history
    Ad history is a on a per day basis. 

    """
    def valid_year(value):
        if value < 2000 or value > 3000:
            raise ValidationError(u'%s is not a valid year ' % value)
    def valid_month(month):
        if month < 1 or month > 12:
            raise ValidationError(u'%s is not a valid month ' % day)
    artist = models.ForeignKey(Artist)
    year = models.IntegerField(validators=[valid_year])
    month = models.IntegerField(validators=[valid_month])
    clicks = models.PositiveIntegerField()
    watches = models.PositiveIntegerField()
    impressions = models.PositiveIntegerField()
    CLOSED = (
        (NO, 'No'),
        (YES, 'Yes'),
        )

    closed = models.IntegerField(default=0, choices = CLOSED)
