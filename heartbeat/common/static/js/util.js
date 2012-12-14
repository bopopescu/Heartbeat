define([
    'jquery',
    'backbone',
    'jquery.filedownload',
], function($, Backbone) {
    return {
        handleClick: function(event) {
          event.preventDefault();
          if ($(event.target).attr('href') !== undefined) {
            Backbone.history.navigate($(event.target).attr("href"), { trigger: true })
          }
        },
        hasOwnProperty: function(obj, prop){
          var proto = obj.__proto__ || obj.constructor.prototype;
          return (prop in obj) &&
          (!(prop in proto) || proto[prop] !== obj[prop]);
        },
        idFromUri: function(uri) {
          var parts = uri.split('/');
          return parts[parts.length-2];
        },
        userResource: function(userid) {
          return "/api/users/users/" + userid + "/";
        },
        featureResource: function(id) {
          return "/api/users/features/" + id + "/";
        },
        voteResource: function(id) {
          return "/api/users/votes/" + id + "/";
        },
        download: function(url) {
          $.fileDownload(url);
          /*var iframe;
          iframe = $("#hiddenDownloader");
          if (iframe.length === 0) {
            $("body").append("<iframe style='display:none' id='hiddenDownloader'></iframe>");
            iframe = $("#hiddenDownloader");
          }
          iframe.attr("src", url);*/
        },
    };
});
