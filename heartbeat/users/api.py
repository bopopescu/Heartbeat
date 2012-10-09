from django.middleware.csrf import get_token
from django.contrib.auth import logout, login, authenticate
from django.contrib.auth.models import User
from django.conf.urls.defaults import url 
from django.db import IntegrityError

from forms import UserForm, ProfileForm
from models import Profile

from tastypie import fields
from tastypie.authentication import Authentication
from tastypie.authorization import Authorization
from tastypie.constants import ALL_WITH_RELATIONS
from tastypie.resources import ModelResource
from tastypie.utils import trailing_slash

import pdb

class UserResource(ModelResource):
    """A resource for accessing users.

    """
    class Meta:
        queryset = User.objects.all()
        resource_name = "user"
        fields = ['username']
        allowed_methods = ['get', 'post']
        include_resource_uri = False
        filtering = {
            "username": ('exact', 'iexact')
            }
        
class CreateProfileResource(ModelResource):
    """A resource for making profiles

    """
    class Meta:
        allowed_methods = ['post']
        resource_name = "register"
        object_class = Profile
        authentication = Authentication()
        authorization = Authorization()
        include_resource_uri = False
        fields = ['username']

    def obj_create(self, bundle, request=None, **kwargs):
        try:
            uForm = UserForm(data = bundle.data)
            pForm = ProfileForm(data = bundle.data)
            if uForm.is_valid() and pForm.is_valid():
                user = uForm.save()
                user.save()
                profile = pForm.save(commit = False)
                profile.user = user
                if not profile.invites:
                    profile.invites = 0
                profile.save()
                user = authenticate(username=bundle.data.get('username'),
                                    password=bundle.data.get('password'))
                login(request, user)
		bundle.obj = profile
            else:
                return self.create_response(request,
                                            {'error': dict(uForm.errors.items() 
                                                           + pForm.errors.items())})
        except IntegrityError:
            pass
        # do any other Profile instantiation stuff here
        return bundle

class ProfileResource(ModelResource):
  """A resource for Profiles
  This resource does all the heavy lifting in case we
  eventually need finer controls over the users.

  """
  user = fields.OneToOneField(UserResource, 'user', full = True)
  class Meta:
    queryset = Profile.objects.all()
    resource_name = 'profile'
    allowed_methods = ['get', 'post']
    filtering = {
      "user": ALL_WITH_RELATIONS
    }

  def override_urls(self):
    return [
      url(r"^(?P<resource_name>%s)/login%s$" % (self._meta.resource_name, trailing_slash()),
          self.wrap_view("login"), name="api_login"),
      url(r"^(?P<resource_name>%s)/loggedin%s$" % (self._meta.resource_name, trailing_slash()),
          self.wrap_view("loggedin"), name="api_loggedin"),
      url(r"^(?P<resource_name>%s)/logout%s$" % (self._meta.resource_name, trailing_slash()),
          self.wrap_view("logout"), name="api_logout")
      ]
  def login(self, request, **kwargs):
    self.method_check(request, allowed=['post'])
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    if user:
      if user.is_active:
        login(request, user)
        try:
          artistid = user.profile.artist.id # see if its an artist
        except:
          artistid = -1
        return self.create_response(request, {
                    'username': user.username,
                    'success': True,
                    'artistid': artistid 
                    })
      else:
        # Inactive account
        return self.create_response(request, {
                    'success': False,
                    'error': 'Your account isn\'t activated yet, you should check your email'
                })
    else:
      # Invalid username/password combo
      return self.create_response(request, {
                  'success': False,
                  'error': "That username/password combo didn't fly..."
              })
  def loggedin(self, request, **kwargs):
    self.method_check(request, allowed=['get'])
    if request.user.is_authenticated():
      username = request.user.username
    else:
      username = ""
    try:
      artist_id = request.user.profile.artist.id
    except:
      artist_id = -1
    return self.create_response(request, {
              'username': username,
              'artistid': artist_id,
            })
  def logout(self, request, **kwargs):
    self.method_check(request, allowed=['get'])
    if request.GET['username'] and request.GET['username'] == request.user.username:
      logout(request)
      return self.create_response(request, { 'success': True })
    return self.create_response(request, { 'success': False })
