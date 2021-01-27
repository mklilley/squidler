
'use strict';

var costPerHint = Config('squidle.costPerHint');
var costPerCharacter = Config('squidle.costPerCharacter');

exports.creditsInfo = {
  name:                   'creditsInfo',
  description:            'I provide information on what credits can buy (debug)',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  middleware:             ["blockGuest"],

  inputs: {
  },

  run: function(api, data, next) {

      data.response.success = true;
      data.response.credits = {hintPrice:costPerHint,disablePrice:costPerCharacter};
      next();

  }
};
