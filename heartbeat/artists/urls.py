from django.conf.urls import patterns, include, url

urlpatterns = patterns(
    'artists.views',
    url(r'^$', 'base'),
    url(r'^(?P<artist_id>\d+)/$', 'base'),
    url(r'^(?P<artist_id>\d+)/admin/$', 'base'),
    )
