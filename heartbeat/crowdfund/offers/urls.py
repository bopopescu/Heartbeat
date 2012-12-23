from django.conf.urls import patterns, include, url

urlpatterns = patterns(
    'crowdfund.views',
    url(r'^new$', 'base'),
    url(r'^new/(?P<artist_id>\d+)/$', 'base'),
    )
