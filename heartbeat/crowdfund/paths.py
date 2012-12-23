
def venue_path(venue, filename):
  return '/'.join(['venues',
                   unicode(venue.name),
                   unicode(filename)])
                   
def campaign_path(campaign, filename):
  return '/'.join(['campaigns',
                  unicode(campaign.artist.name),
                  unicode(campaign.title),
                  unicode(filename)])

