define([
    'jquery',
    'backbone',
    'underscore',
    'util',
], function($, Backbone, _, util) {
  var Feature = Backbone.Model.extend({
    defaults: {
      url: function() {
        return "/api/users/features/" + (this.get("id") >= 0) ? (id + "/") : ""; 
      },
    },

    initialize: function() {
      _.bindAll(this, "votes");
    },

    votes: function() {
      var votes = this.get("votes"),
          score = 0;
      if (!votes) { return 0; }
      for (var i = 0; i < votes.length; i++) {
        score += (votes[i].up) ? 1 : -1; 
      }
      return score;
    },
    // Returns the vote id associated with the user for this feature, 
    // or -1 if there is none
    getVote: function(userid) {
      var ret = undefined;
      _.each(this.get("votes"), function(vote) {
        console.log(vote);
        if (userid == util.idFromUri(vote.user)) {
          ret = vote;
          return true;
        }
      });
      return ret;
    },
    addVote: function(vote) {
      this.get("votes").push(vote);
      this.trigger("change");
    },
  });

  return Feature;
});
