from django.contrib.auth.models import User
from django.db import models

class Feature(models.Model):
  created_by = models.ForeignKey(User)
  slug = models.CharField(max_length=300)
  accepted = models.BooleanField()
  rejected = models.BooleanField()
  created_at = models.DateTimeField(auto_now_add=True)

class Vote(models.Model):
  user = models.ForeignKey(User)
  feature = models.ForeignKey(Feature)
  up = models.BooleanField()
  class Meta:
    # A user can vote on a feature only once
    unique_together = ['user', 'feature']
