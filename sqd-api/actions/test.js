'use strict';

exports.testRun = {
  name:                   'testRun',
  description:            'I run tests',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  middleware:             [],

  inputs: {},

  run: function(api, data, next) {
    api.test.run()
        .then(message => {
          data.response.success = true;
          data.response.message = message;
          next();
        })
        .catch(error => {
          next(error);
        });
  }
};
