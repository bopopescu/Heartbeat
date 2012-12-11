define([
    'jquery',
    'backbone',
    'underscore',
    'feature',
    'util',
    'text!templates/feature.html',
    'timeago',
], function($, Backbone, _, Feature, util, featureTemplate) {
  FeatureView = Backbone.View.extend({
    events: {
      "click .icon-thumbs-up": "upvote",
      "click .icon-thumbs-down": "downvote",
    },
    initialize: function(options) {
      _.bindAll(this, 'render', 'upvote', 'downvote');
      this.options = _.extend({}, options);
      this.model.bind("change", this.render);
    },
    render: function() {
      var self = this;
      this.$el.html(_.template(featureTemplate, {
        vote: self.model.getVote(self.options.user_id),
        feature: self.model,
        index: self.options.index,
      }));
      $(".timeago").timeago();
      return this;
    },
    upvote: function(event) {
      this.vote(true);
    },
    downvote: function(event) {
      this.vote(false);
    },
    vote: function(up) {
      var vote = new Vote(),
          feature = this.model,
          prevvote = feature.getVote(this.options.user_id),
          attrs = {
            user: util.userResource(this.options.user_id),
            feature: feature.id,
            up: up,
          };
      if (prevvote && prevvote.id >= 0) {
        vote.id = prevvote.id;
        if (prevvote.up == up) { // If we aren't changing the truthyness of the vote
          return;
        }
      }
      vote.save(attrs, {
        error: function() {

        },
        success: function(model) {
          var id = (typeof model.id === 'number') ? model.id : util.idFromUri(model.id);
          attrs.id = id;
          attrs.resource_uri = util.featureResource(id);
          if (prevvote) {
            prevvote.up = up;
            feature.trigger("change");
          } else {
            feature.addVote(attrs);
          }
        },
      });
    },
  });
  Vote = Backbone.Model.extend({
    url: function() {
       return "/api/users/votes/" + ((this.id >= 0) ? (this.id + "/") : "");
    },
  });
  return FeatureView;
});
