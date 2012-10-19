jqTwitter = {
    loadPortlet: function(t, $twitterPortlets) {
        var $twitterPortlet = $twitterPortlets.eq(t),
            $item = $twitterPortlet.find('.noTweets'),
            data = $twitterPortlet.data(),
            userType = data.type == 'user' ? true : false,
            number = data.number,
            showAvatar = data.showavatar,
            showInfo = data.showinfo,
            showUser = data.showuser,
            api = userType ? 'http://api.twitter.com/1/statuses/user_timeline.json/' : 'http://search.twitter.com/search.json',
            request = (userType ? 
                { screen_name: data.term,
                  include_rts: true,
                  count: data.number,
                  include_entities: true } :
                { q: data.term });
        
        $.ajax({
            url: api,
            type: 'GET',
            dataType: 'jsonp',
            data: request,            
            error: function(data, textStatus, xhr) {
                $item.show();
            },
            success: function(data, textStatus, xhr) {
                var userInfo = '<dd class="portletItem info">AVATAR DESCRIPTION URL</dd>'
                    tweet = '<dd class="portletItem ODD tweet">AVATAR NAME TWEET_TEXT <span class="time">AGO</span></dd>',
                    $container = $('<dl />');
                data = userType ? data : data.results;
                if (data.length > 0 && userType) {
                    var u = data[0].user,
                        AVATAR = showAvatar ? '<img title="NICK" alt="NICK" class="avatar tileImage" src="' + u.profile_image_url + '" />' : '',
                        URL = u.url;
                    if (showInfo && showUser) {
                        $container.append(
                            userInfo
                                .replace('AVATAR', AVATAR )
                                .replace('DESCRIPTION', u.description)
                                .replace('URL', '<a href="'+URL+'">'+URL+'</a>' )
                                .replace(/USER/g, u.screen_name)
                                .replace(/NICK/g, u.name)
                        );
                    }
                    if (showUser) {
                        var link = '<a class="twitterUser" href="http://twitter.com/USER">NICK</a>';
                        if (!showInfo) link = AVATAR + link;
                        $twitterPortlet.find('.portletHeader .portletTitle').eq(0).replaceWith(
                            link
                                .replace(/USER/g, u.screen_name)
                                .replace(/NICK/g, u.name)
                        );
                    }
                    if (!showUser) {
                        $twitterPortlet.find('.portletHeader .portletTitle').prepend(AVATAR)
                    }
                }; 
                lng = data.length < number ? data.length : number;
                for (var i = 0; i < lng; i++) {
                    $container.append(
                        tweet
                            .replace('ODD', i % 2 === 0 ? 'odd' : 'even' )
                            .replace('NAME', userType ? '' : '<a href="http://twitter.com/USER">NICK</a>:')
                            .replace('AVATAR', (!userType && showAvatar) ? '<img title="NICK" alt="NICK" class="avatar tileImage" src="' + data[i].profile_image_url + '" />' : '' )
                            .replace('TWEET_TEXT', jqTwitter.ify.clean(data[i].text) )
                            .replace(/USER/g, userType ? data[i].user.screen_name : data[i].from_user)
                            .replace(/NICK/g, userType ? data[i].user.name : data[i].from_user_name)
                            .replace('AGO', jqTwitter.timeAgo(data[i].created_at) )
                            .replace(/ID/g, data[i].id_str)
                        );
                 };
                 $item.replaceWith($container.children());
                 t++;
                 if (t < $twitterPortlets.length) jqTwitter.loadPortlet(t, $twitterPortlets);
            }
        });
    },
    init: function() {
        // core function of jqtweet
        var $twitterPortlets = $(".portletTwitter"),
            t = 0;
        
        if ($twitterPortlets.length > 0) {
            $twitterPortlets.find(".noTweets").hide();
            jqTwitter.loadPortlet(t, $twitterPortlets);     
        };
    },
    
    timeAgo: function(dateString) {
        /**
          * relative time calculator FROM TWITTER
          * @param {string} twitter date string returned from Twitter API
          * @return {string} relative time like "2 minutes ago"
          */
        var rightNow = new Date(),
            then = !$.browser.msie ? new Date(dateString) :Date.parse(dateString.replace(/( \+)/, ' UTC$1')),
            diff = rightNow - then,
            second = 1000,
            minute = second * 60,
            hour = minute * 60,
            day = hour * 24,
            week = day * 7;
 
        if (isNaN(diff) || diff < 0)        { return "" }
        if (diff < second * 2)              { return "right now" }
        if (diff < minute)                  { return Math.floor(diff / second) + " seconds ago" }
        if (diff < minute * 2)              { return "about 1 minute ago" }
        if (diff < hour)                    { return Math.floor(diff / minute) + " minutes ago" }
        if (diff < hour * 2)                { return "about 1 hour ago" }
        if (diff < day)                     { return  Math.floor(diff / hour) + " hours ago" }
        if (diff > day && diff < day * 2)   { return "yesterday" }
        if (diff < day * 365)               { return Math.floor(diff / day) + " days ago" }
        else                                { return "over a year ago" }
    },

    ify: {
        /**
         * The Twitalinkahashifyer!
         * http://www.dustindiaz.com/basement/ify.html
         * Eg:
         * ify.clean('your tweet text');
         */ 
        link: function(tweet) {
            return tweet.replace(/\b(((https*\:\/\/)|www\.)[^\"\']+?)(([!?,.\)]+)?(\s|$))/g, function(link, m1, m2, m3, m4) {
                var http = m2.match(/w/) ? 'http://' : '';
                return '<a class="twtr-hyperlink" target="_blank" href="' + http + m1 + '">' + ((m1.length > 25) ? m1.substr(0, 24) + '...' : m1) + '</a>' + m4;
            });
        }, 
        at: function(tweet) {
            return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20})/g, function(m, username) {
                return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/intent/user?screen_name=' + username + '">@' + username + '</a>';
            });
        }, 
        list: function(tweet) {
            return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20}\/\w+)/g, function(m, userlist) {
                return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/' + userlist + '">@' + userlist + '</a>';
            });
        }, 
        hash: function(tweet) {
            return tweet.replace(/(^|\s+)#(\w+)/gi, function(m, before, hash) {
                return before + '<a target="_blank" class="twtr-hashtag" href="http://twitter.com/search?q=%23' + hash + '">#' + hash + '</a>';
            });
        }, clean: function(tweet) {
            return this.hash(this.at(this.list(this.link(tweet))));
        }
    }
};

$(document).ready(function () {
    jqTwitter.init();
});