'use strict';

var api;

module.exports = {
  loadPriority:  1003,
  startPriority: 1003,
  stopPriority:  1003,
  initialize: function(_api, next){
    api      = _api;                 // A bit useless here
    api.formatter = {};

    api.formatter.lowercase = function(param){
       return param.toLowerCase();
    }

    api.formatter.hash = function(param){
      return Hash(param);
    }

    api.formatter.removeWhiteSpace = function(param){
      return param.replace(/ /g, "");
    }

    api.formatter.boolToBinary = function(param){
      if(typeof param === "boolean"){
        return param ? 1 : 0;
      }
      else{
        return param;
      }
    }

    api.formatter.stringToNumber = function(param){
      return parseInt(param);
    }

    api.formatter.timeSeconds = function(param){
        let timeSec = parseInt(param);
        if(isNaN(timeSec) && typeof param ==="string"){
          var date = new Date(param);
          timeSec = Math.floor(date.getTime()/1000);
        }
          return timeSec;

    }

    api.formatter.modelName = function(param){
      param = param.toLowerCase();
      return param.charAt(0).toUpperCase() + param.slice(1);
    }

    next();
  },
  start: function(_api, next){
    next();
  },
  stop: function(_api, next){
    next();
  }
};
