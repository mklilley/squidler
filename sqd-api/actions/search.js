
'use strict';

exports.searchCreate = {
  name:                   'searchCreate',
  description:            'I do an image search (debug)',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  middleware:             ["blockGuest"],

  inputs: {
      queryString:{
          required:true
      },
      startIndex:{
          required:false
      }
  },

  run: function(api, data, next) {


    api.search.search(data.params.queryString, data.params.startIndex)
        .then(results => {
          data.response.success = true;
          data.response.search = results;
          next();
        })
        .catch(error => {
          next(error);
        });
  }
};
