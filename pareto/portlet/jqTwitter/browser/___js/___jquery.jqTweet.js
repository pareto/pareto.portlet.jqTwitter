(function($) {
    //This is comment exists solely to be a change.
    processTweets = function(jsonData) {
        var searchResults = json_to_object(jsonData);
        if(searchByAuthor) {
            for(var i = 0; i < searchResults.results.length; i++) {
                if(searchResults.results[i].from_user.toLowerCase() == searchTerm.toLowerCase()) {
                    $(callingDiv).append("<div class='tweet-wrapper'>" + searchResults.results[i].text + "</div><hr>");
                }
            }
        } else {
            for(var i = 0; i < searchResults.results.length; i++) {
                $(callingDiv).append("<div class='tweet-wrapper'>" + searchResults.results[i].text + "</div><hr>");
            }
        }
    };
    json_to_object = function(object_var) {
        if( typeof object_var == 'object') {
            return object_var;
        }
        if( typeof object_var != 'string') {
            return false;
        }
        return eval('(' + object_var + ')');
    };
    var callingDiv;
    var searchByAuthor;
    var searchTerm;
    var methods = {
        init : function(options) {
            var options = $.extend({
                term : "jQuery",
                author : false,
            }, options);
            callingDiv = $(this);
            searchByAuthor = options.author;
            searchTerm = options.term;
            var searchURL = "http://search.twitter.com/search.json?&q=" + encodeURIComponent(options.term) + "&callback=processTweets&_" + new Date().getTime();
            $(this).append("<script src='" + searchURL + "'></script>");
        },
        hide : function() {
            $(this).hide();
        },
        show : function() {
            $(this).show();
        },
        /*refresh : function() {

         },*/
    };

    $.fn.jqTweet = function(method) {
        if(methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if( typeof method == 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error("Method " + method + " does not exist on jQuery.jqTweet");
        }
    };
})(jQuery);

$(document).ready(function() {
    var $jqTweetPortlets = $(".portletJqTweet");
    
    for(var i = 0; i < $portletJqTweet.length; i++) {
        var $jqTweetPortlet = $jqTweetPortlets.eq(i),
            options = {
                term : $jqTweetPortlet.prop('data-term'),
                author : $jqTweetPortlet.prop('data-author'),
                repeat : $jqTweetPortlet.prop('data-repeat'),
            },
            pid = 'jq-tweet-'+i; 
        $jqTweetPortlet
            .prop('id', pid)
            .jqTweet(options)
            .jqTweet("hide")
            .jqTweet("show");
    }
});
