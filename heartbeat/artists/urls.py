from django.conf.urls import patterns, include, url

urlpatterns = patterns(
    'artists.views',
    url(r'^$', 'base'),
    url(r'^(?P<artist_id>\d+)/$', 'base'),
    url(r'^(?P<artist_id>\d+)/admin/$', 'base'),
    url(r'^(?P<artist_id>\d+)/admin/album/(?P<album_id>\d+)/$', 'base'),
    url(r'^(?P<artist_id>\d+)/admin/album/new/$', 'post_album'),
    url(r'^(?P<artist_id>\d+)/admin/album/edit/(?P<album_id>\d+)/$', 'put_album'),
    )
