from django.db import models
from django.contrib.auth.models import User

from artists.models import Artist

from crowdfund.paths import venue_path, campaign_path

SHIPPING_CHOICES = (
  (0, "No Shipping"),
  (1, "Shipping within the US"),
  (2, "Shipping anywhere in the world!"),
)

class Demand(models.Model):
  user = models.ForeignKey(User)
  artist = models.ForeignKey(Artist)

class Venue(models.Model):
  name = models.CharField(max_length=100)
  image = models.ImageField(upload_to=venue_path)
  blurb = models.CharField(max_length=160)
  description = models.TextField()

  lat = models.FloatField()
  lon = models.FloatField()

  address = models.CharField(max_length=50)
  city = models.CharField(max_length=50)
  state_province = models.CharField(max_length=30)
  country = models.CharField(max_length=50)

class Campaign(models.Model):
  artist = models.ForeignKey(Artist)
  title = models.CharField(max_length=60)
  blurb = models.CharField(max_length=160)
  image = models.ImageField(upload_to=campaign_path)
  # DONT FORGET VIDEO video = 
  description = models.TextField()
  class Meta:
    abstract = True

class ConcertCampaign(Campaign):
  venue = models.ForeignKey(Venue)
  date = models.DateTimeField()
  
class Offer(models.Model):
  artist = models.ForeignKey(Artist)
  venue = models.ForeignKey(Venue)
  goal = models.IntegerField()
  percent = models.BooleanField(default=False)
  fee = models.IntegerField()

class Reward(models.Model):
  campaign = models.ForeignKey(ConcertCampaign)
  num = models.IntegerField()
  amount = models.IntegerField()
  description = models.TextField()
  month = models.IntegerField()
  year = models.IntegerField()
  shipping = models.IntegerField(choices=SHIPPING_CHOICES)
  num_avail = models.IntegerField()
  taken = models.IntegerField()
  person_limit = models.IntegerField(default=1)
