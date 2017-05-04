'use strict';

const colors = require('colors');

exports.log = (message) => {
  let date = new Date();

  console.log(
    colors.white(`[${date.toLocaleDateString()} ${date.toLocaleTimeString()}] ${message}`)
  )
};

exports.error = (message) => {
  let date = new Date();

  console.log(
    colors.red(`[${date.toLocaleDateString()} ${date.toLocaleTimeString()}] ${message}`)
  )
};
