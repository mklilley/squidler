'use strict';

var api;

module.exports = {
  loadPriority:  1003,
  startPriority: 1003,
  stopPriority:  1003,
  initialize: function(_api, next){
    api      = _api;                 // A bit useless here
    api.shorten = Controller('Shorten');  // registration

    next();
  },
  start: function(_api, next){
    next();
  },
  stop: function(_api, next){
    next();
  }
};
