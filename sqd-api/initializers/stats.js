'use strict';

var api;

module.exports = {
  loadPriority:  1003,
  startPriority: 1003,
  stopPriority:  1003,
  initialize: function(_api, next){
    api      = _api;                 // A bit useless here
    api.stats = Controller('Stats');  // registration
    // I am not sure that here is the best place to be settig up the guest account on redis.
    api.stats.create();

    next();
  },
  start: function(_api, next){
    next();
  },
  stop: function(_api, next){
    next();
  }
};
