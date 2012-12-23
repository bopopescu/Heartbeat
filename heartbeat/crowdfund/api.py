from tastypie import fields
from tastypie.authorization import Authorization
from tastypie.resources import ModelResource

from artists.api import ArtistResource
from crowdfund.models import ConcertCampaign, Reward


class CampaignResource(ModelResource):
  artist = fields.ForeignKey(ArtistResource, 'artist')  

  class Meta:
    resource_name = 'campaign'
    queryset = ConcertCampaign.objects.all()
    authorization = Authorization()

    
class RewardResource(ModelResource):
  campaign = fields.ForeignKey(CampaignResource, 'campaign')

  class Meta:
    resource_name = 'reward'
    queryset = Reward.objects.all()
    authorization = Authorization()

