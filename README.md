An example Express & ws (websockets) server & client for notifying clients when a YouTube channel goes live.
------------------------------------------------------------------------------------------------------------

Running:
--------

Run `npm start` then navigate to `localhost:3000/live` in your browser.

Wait 60 seconds and you should see the following:
1) Browser will display `LIVE: false` or `LIVE: true`, depending on whether or not the stream is live.
2) Console will output the same thing every minute.

If you would like to increase the frequency of updates, change `INTERVAL` in `index.js`.

Update Frequency:
------------------

By default, the server is set to update every 60 seconds (1 minute). The YouTube API allows a quota of 1,000,000 per day (24 hours).
Each request to the API incurs a cost of roughly 100. Thus, roughly 10,000 requests are allowed per day (1,000,000 / 100).

This would require 7 requests per min per hour (7 * 60 * 24 = 10080) to reach (and exceed) the threshold.
Running 1 request per min per hour uses about 1/10th of the allotted quota (60 * 24 = 1440).

It is likely overkill to update every 10 seconds, but it is still within the allotted quota (6 * 60 * 24 = 8640).

Uses:
-----

This project is primarily a proof of concept, but the motivation behind this project is reducing rate limits.

For example:

The YouTube API limits requests per day (for this request) to roughly 10,000 per day.
If 10,000 users access our endpoint, we've exceeded the quota for the day, and that could have occurred in a matter of seconds.

Solution 1:

Have a server poll the YouTube API every minute and store whether or not the channel is live.
Clients will then retrieve the status via an HTTP endpoint at some interval.

Issues (Solution 1):

1) While the requests to the YouTube API have been offloaded, they've been placed onto the HTTP server instead.
2) Clients continually have to poll the HTTP server for a status update at some interval.

Solution 2 (This Project):

Similar strategy as above. Server will poll the YouTube API at some interval and store whether or not the channel is live.

Have a WebSocket server send out the status to every client when the status changes.