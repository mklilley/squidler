'use strict';

var api;
var maxExpiryHrs = Config('squidle.EXPIRY_HRS_MAX');

module.exports = {
  loadPriority:  1003,
  startPriority: 1003,
  stopPriority:  1003,
  initialize: function(_api, next){
    api      = _api;                 // A bit useless here
    api.validator = {};

    api.validator.email = function(param){
       if(typeof param === "string" && param.indexOf("@")!==-1 && param.length<=255){return true;}else{return param + " is not a valid email"};
    }

    api.validator.string = function(param){
      if(typeof param === "string" && param.length<=2000){return true}else{return param + " is not a valid string"};
    }

    api.validator.nonEmptyObject = function(param){
      if(typeof param === "object" && Object.keys(param).length !== 0){return true}else{return param + " is not a valid non-empty JavaScript object"};
    }

    api.validator.token = function(param){
      if(typeof param === "string" && /^[a-zA-Z0-9]+$/.test(param)){return true}else{return param + " is not a valid authorisation token"};
    }

    api.validator.username = function(param){
      if(typeof param === "string" && param.length<=20 && /^[a-zA-Z0-9-_]+$/.test(param)){return true}else{return param + " is not a valid username"};
    }

    api.validator.binary = function(param){
      if(typeof param === "number" && (param === 0 || param === 1) ){return true}else{return param + " is not a valid binary input"};
    }

    api.validator.boolean = function(param){
      if(typeof param === "boolean"){return true}else{return param + " is not a valid boolean input"};
    }

    api.validator.expiry = function(param){

      let date = new Date();
      date.setHours(date.getHours() + maxExpiryHrs);
      let allowed =  Math.floor(date.getTime()/1000);

      if(typeof param === "number" && param % 1 === 0 && param<=allowed){return true}else{return param + " is not a valid expiry time for your Squidle"};
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
