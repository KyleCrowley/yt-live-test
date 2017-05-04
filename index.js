'use strict';

const axios = require('axios');
const express = require('express');
const path = require('path');
const WebSocketServer = require('ws').Server;

const logger = require('./logger');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const YT_API_KEY = process.env.YT_API_KEY || '';
const YT_CHANNEL_ID = process.env.YT_CHANNEL_ID || '';

const INTERVAL = 1000 * 60; // 60 seconds (1 minute)

if (YT_API_KEY === '' || YT_CHANNEL_ID === '') {
  logger.error("YouTube API key or YouTube channel ID was not set. Exiting.");
  process.exit(0);
}

const server = express()
  .use((req, res) => res.sendFile(INDEX))
  .listen(PORT, () => logger.log(`Listening on ${ PORT }.`));

const wss = new WebSocketServer({ server: server, path: '/live' });

let currentStatus = false;
wss.on('connection', (ws) => {
  ws.send('' + currentStatus);
  logger.log('Client connected.');
  ws.on('close', () => logger.log('Client disconnected.'));
});

setInterval(() => {
  axios.get('https://www.googleapis.com/youtube/v3/search', {
    params: {
      part: 'snippet',
      channelId: YT_CHANNEL_ID,
      type: 'video',
      eventType: 'live',
      key: YT_API_KEY
    }
  })
    .then((res) => {
      let newStatus = res.data['items'].length > 0;
      if (newStatus == currentStatus) {
        logger.log(`STATUS DID NOT CHANGE.`);
        return;
      }

      currentStatus = newStatus;

      logger.log(`LIVE: ${currentStatus}`);

      wss.clients.forEach((client) => {
        client.send('' + currentStatus);
      });
    })
    .catch((err) => logger.error(err));
}, INTERVAL);