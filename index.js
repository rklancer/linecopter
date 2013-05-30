var cv = require('opencv'),
    detect = require('./lib/detect');

module.exports = {
  detect: detect
};

detect();