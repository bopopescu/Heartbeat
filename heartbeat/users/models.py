from django.contrib.auth.models import User
from django.db import models

from artists.models import Artist, Album, Song

NO = 0
YES = 1

class Profile(models.Model):
    user = models.OneToOneField(User, editable=False)
    invites = models.IntegerField()

    def __unicode__(self):
        return unicode(self.user)

