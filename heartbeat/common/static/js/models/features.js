define([
    'jquery',
    'backbone',
    'underscore',
    'feature',
], function($, Backbone, _, Feature) {
  var Features = Backbone.Collection.extend({
    model: Feature,
    url: "/api/users/features/",
  });
  return Features;
});
