'use strict';

var api;

module.exports = {
  loadPriority:  1003,
  startPriority: 1003,
  stopPriority:  1003,
  initialize: function(_api, next){
    api      = _api;                 // A bit useless here
    api.actions.addMiddleware(Middleware('Auth'));
    api.actions.addMiddleware(Middleware('Tasks'));
    api.actions.addMiddleware(Middleware('Guest'));
    api.actions.addMiddleware(Middleware('Admin'));
    api.actions.addMiddleware(Middleware('User'));
    api.actions.addMiddleware(Middleware('Squidle'));
    api.actions.addMiddleware(Middleware('Hint'));
    api.actions.addMiddleware(Middleware('UpdateSquidle'));
    api.actions.addMiddleware(Middleware('CreateUsername'));




    next();
  },
  start: function(_api, next){
    next();
  },
  stop: function(_api, next){
    next();
  }
};
