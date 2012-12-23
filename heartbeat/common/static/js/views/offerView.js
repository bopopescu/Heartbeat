define([
  'jquery',
  'backbone',
  'underscore',
  'text!templates/editOffer.html',
], function($, Backbone, _, OfferTemplate) {
  var google;
  var OfferView = Backbone.View.extend({

    initialize: function() {
      var self = this;
      this.options.ready = false;
      window.ready = function() {
        new window.google.maps.places.Autocomplete($("#location")[0]);
      }
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyDyBDxtK7PW0aRieHECxuqPyXIVHeWWK4Q&sensor=false&libraries=places&callback=ready"
      document.body.appendChild(script)
    },

    render: function() {
      $(this.$el).html(_.template(OfferTemplate, this.model.toJSON()));
      if (this.options.ready) {
        new google.maps.places.Autocomplete($("#location")[0], { types: ['regions', 'cities'] });
      }
    },
  });
  return OfferView;
}); 
