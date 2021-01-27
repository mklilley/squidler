
'use strict';

exports.shortenCreate = {
  name:                   'shortenCreate',
  description:            'I shorten a URL (debug)',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  middleware:             ["blockGuest"],

  inputs: {
      url:{
          required:true,
          validator: ['api.validator.string'],
          formatter: ['api.formatter.removeWhiteSpace']
      }
  },

  run: function(api, data, next) {


    api.shorten.shorten(data.params.url)
        .then(shortURL => {
          data.response.success = true;
          data.response.shortener = shortURL;
          next();
        })
        .catch(error => {
          next(error);
        });
  }
};
