define([
    'jquery',
    'backbone',
    'underscore',
    'features',
    'feature',
    'util',
    'text!templates/featureList.html',
    'text!templates/feature.html',
    'text!templates/newFeature.html',
    'views/featureView',
    'jquery.forms',
    'timeago',
], function($, Backbone, _, Features, Feature, util, featureListTemplate, featureTemplate, newFeatureTemplate, FeatureView) {
  FeatureListView = Backbone.View.extend({
    el: $("#features"),
    events: {
      "click #addfeature": "openform",
    //  "click .icon-thumbs-up": "upvote",
    //  "click .icon-thumbs-down": "downvote",
    },
    defaults: {
      user_id: -1,
      list: ".featurelist",
      index: 0,
    },
    initialize: function(options) {
      _.bindAll(this, 'render', 'openform', 'add');
      this.collection.bind("add", this.add);
      this.options = _.extend(this.defaults, options);
    },
    add: function(model, silent) {
      model.bind("change", this.rerender);
      var toAppend = new FeatureView({
        model: model,
        index: this.options.index,
        user_id: this.options.user_id,
      }).render().$el;
      if (silent === true) {
        toAppend.appendTo($(this.options.list));
      } else {
        toAppend.hide().appendTo($(this.options.list)).slideDown('slow');
        $(".timeago").timeago();
      }
      this.options.index += 1;
    },
    render: function() {
      var self = this;
      $(this.el).html(_.template(featureListTemplate, { 
        features: this.collection, 
        user_id: this.options.user_id 
      }));
      this.collection.each(function(model) { self.add(model, true); });
      $(".timeago").timeago();
    },
    openform: function() {
      var self = this;
      if (!this.options.open) {
        this.options.open = true;
        $(_.template(newFeatureTemplate, { 
          user_id: this.options.user_id 
        })).hide().appendTo(this.el).slideDown('medium');

        $(this.el).find("#nevermind").click(function() {
          self.options.open = false;
          $(self.el).find("form").remove();
        });
        $(this.el).find("form").submit(function() {
          new Feature().save({
            slug: $("#slug").val(),
            created_by: util.userResource(self.options.user_id),
            accepted: $("#accepted").val(),
            rejected: $("#rejected").val(),
          }, {
            success: function(model) {
              self.collection.add(model);
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
    /*
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
    */
  });
  Vote = Backbone.Model.extend({
    url: function() {
       return "/api/users/votes/" + ((this.id >= 0) ? (this.id + "/") : "");
    },
  });
  return FeatureListView;
});
