Introduction
============
This product installs a Plone portlet which shows tweets of a twitter user or 
hashtag search. Instead of using the python integration with twitter is uses
the twitter javascript api. It loads the tweets asynchoniously. This api has a 
limit of 150 calls per hour per ip, this should not pose a problem for most 
users.

TODO
====
- Add caching of the twitter json so calling more than 150 times per minute 
will not result in an empty portlet.
- Add auto refresh with timing when caching is arranged.
