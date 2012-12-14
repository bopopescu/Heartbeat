from django.shortcuts import render_to_response
from django.template import RequestContext

def ajax_required(function):
    def decorator(request, *args, **kwargs):
        if not request.is_ajax():
            return render_to_response("base.html", context_instance=RequestContext(request))
        return function(request, *args, **kwargs)
    return decorator
        
def ajaxify(function):
  def decorator(request, *args, **kwargs):
    if request.is_ajax():
      return HttpResponse(function(request, *args, **kwargs))
    else:
      template = function(request, *args, **kwargs)
      outline = templates.Base()
      outline.set_body(template)
      return HttpResponse(outline)
  return decorator

