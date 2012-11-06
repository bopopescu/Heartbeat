from django.contrib.auth.models import User

from tastypie import fields
from tastypie.resources import ModelResource
from tastypie.authorization import Authorization

from artists.api import ArtistResource
from userdata.models import Subscription

class UserResource(ModelResource):
  class Meta:
    resource_name = 'users'
    queryset = User.objects.all()


class FollowResource(ModelResource):
  profile = fields.ForeignKey(UserResource, 'profile')
  artist = fields.ForeignKey(ArtistResource, 'artist')
  class Meta:
    resource_name = 'follow'
    queryset = Subscription.objects.all()
    authorization = Authorization()

