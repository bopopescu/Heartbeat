define([
    'jquery',
    'backbone',
], function($, Backbone) {
    return {
        handleClick: function(event) {
          event.preventDefault();
            if ($(event.target).attr('href') !== undefined) {
              Backbone.history.navigate($(event.target).attr("href"), { trigger: true })
            }
        },
        download: function(url) {
          var iframe;
          iframe = $("#hiddenDownloader");
          if (iframe.length === 0) {
            $("body").append("<iframe style='display:none' id='hiddenDownloader'></iframe>");
            iframe = $("#hiddenDownloader");
          }
          iframe.attr("src", url);
        },
    };
});
