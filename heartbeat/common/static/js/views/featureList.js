define([
    'jquery',
    'backbone',
    'underscore',
    'features',
    'feature',
    'util',
    'text!templates/featureList.html',
    'text!templates/newFeature.html',
    'jquery.forms',
    'timeago',
], function($, Backbone, _, Features, Feature, util, featureListTemplate, newFeatureTemplate) {
  FeatureListView = Backbone.View.extend({
    el: $("#features"),
    events: {
      "click #addfeature": "openform",
      "click .icon-thumbs-up": "upvote",
      "click .icon-thumbs-down": "downvote",
    },
    defaults: {
      user_id: -1,
    },
    initialize: function(options) {
      _.bindAll(this, 'render', 'openform', 'vote');
      this.collection.bind("change", this.render);
      this.options = _.extend(this.defaults, options);
    },
    render: function() {
      console.log(this.collection)
      $(this.el).html(_.template(featureListTemplate, { 
        features: this.collection, 
        user_id: this.options.user_id 
      }));
      $(".timeago").timeago();
    },
    openform: function() {
      if (!this.options.open) {
        this.options.open = true;
        $(_.template(newFeatureTemplate, { user_id: this.options.user_id })).hide().appendTo(this.el).slideDown('medium');
        var that = this;
        $(this.el).find("#nevermind").click(function() {
          that.options.open = false;
          $(that.el).find("form").remove();
        });
        $(this.el).find("form").submit(function() {
          new Feature().save({
            slug: $("#slug").val(),
            created_by: util.userResource(that.options.user_id),
            accepted: $("#accepted").val(),
            rejected: $("#rejected").val(),
          }, {
            success: function(a,b,c) {
              console.log(a);         
              console.log(b);         
              console.log(c);         
            },
            error: function(a,b,c) {
              console.log(a);         
              console.log(b);         
              console.log(c);         
            },
          });
          return false;
        });
      }
    },
    upvote: function(event) {
      var target = $(event.currentTarget);
      this.vote(parseInt(target.data("index")), target.attr('id'), true);
    },
    downvote: function(event) {
      var target = $(event.currentTarget);
      this.vote(parseInt(target.data("index")), target.attr('id'), false);
    },
    vote: function(featureIndex, featureId, up) {
      var vote = new Vote(),
          feature = this.collection.models[featureIndex],
          prevvote = feature.getVote(this.options.user_id),
          attrs = {
            user: util.userResource(this.options.user_id),
            feature: featureId,
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
  return FeatureListView;
});
