from django.http import HttpResponse

from decorators import ajax_required

@ajax_required
def base(request):
  return HttpResponse("")
