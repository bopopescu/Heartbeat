from django.conf.urls import patterns, include, url

urlpatterns = patterns(
    'users.views',
    url(r'^$', 'base'),
    url(r'^login/$', 'base'),
    url(r'^register/$', 'base'),
    url(r'^(?P<user_id>\d+)/$', 'base'),
    )
