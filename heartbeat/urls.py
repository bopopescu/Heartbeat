from django.conf import settings
from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from tastypie.api import Api

from artists.api import ArtistResource, ArtistDetailsResource, HotAlbumResource, AlbumResource, SongResource
from users.api import UserResource, CreateProfileResource, ProfileResource

from userdata.api import UserResource, FollowResource

#from crowdfund.api import CampaignResource, RewardResource

admin.autodiscover()

users_api = Api(api_name="users")
users_api.register(UserResource())
users_api.register(ProfileResource())
users_api.register(CreateProfileResource())

users_api.register(ArtistResource())
users_api.register(ArtistDetailsResource())
users_api.register(AlbumResource())
users_api.register(SongResource())
users_api.register(HotAlbumResource())

users_api.register(UserResource())
users_api.register(FollowResource())

#users_api.register(CampaignResource())
#users_api.register(RewardResource())

urlpatterns = patterns(
    '',
    # Examples:
    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^register/', 'users.views.register'),
    url(r'^', include('artists.urls')),
    url(r'^users/', include('users.urls')),
    url(r'^artists/', include('artists.urls')),
    url(r'^offers/', include('crowdfund.offers.urls')),
    url(r'^features/', 'artists.views.base'),
    url(r'^api/', include(users_api.urls)),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^newsletters/', include('emencia.django.newsletter.urls')),
    url(r'^accounts/', include('registration.backends.default.urls')),
)
urlpatterns += patterns('',
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {
      'document_root': settings.MEDIA_ROOT,
      }),
    )
urlpatterns += staticfiles_urlpatterns()
