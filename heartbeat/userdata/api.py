from tastypie.resources import ModelResource

from userdata.models import Subscription

class FollowResource(ModelResource):
  class Meta:
    resource_name = 'follow'
    queryset = Subscription.objects.all()

