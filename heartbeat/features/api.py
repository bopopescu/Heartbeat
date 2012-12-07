from tastypie import fields
from tastypie.authorization import Authorization
from tastypie.authentication import Authentication
from tastypie.resources import ModelResource

from userdata.api import UserResource

from features.models import Feature, Vote

class FeatureResource(ModelResource):
  created_by = fields.ForeignKey(UserResource, 'created_by')
  votes = fields.ToManyField('features.api.VoteResource', 'vote_set', full=True, blank=True)

  class Meta:
    resource_name = 'features'
    queryset = Feature.objects.all()
    list_allowed_methods = ['get', 'post']
    authorization = Authorization()
    authentication = Authentication()

class VoteResource(ModelResource):
  user = fields.ForeignKey(UserResource ,'user')
  feature = fields.ForeignKey(FeatureResource, 'feature')
  class Meta:
    resource_name = 'votes'
    queryset = Vote.objects.all()
    list_allowed_methods = ['get', 'post', 'put']
    authorization = Authorization()
