'use strict';

var defaultExpiryHrs = Config('squidle.EXPIRY_HRS');

exports.createWelcomeSquidle = {
  name:          'createWelcomeSquidle',
  description:   'Create welcome squidle every 24 hours so that there is always a fresh Squidle for demonstration purposes',
  frequency:     defaultExpiryHrs*3600000,
  queue:         'default',
  plugins:       [],
  pluginOptions: [],

  run: function(api, params, next){

      api.squidle.createWelcome().then(()=>{
        next();
      }).catch((error)=>{
          next(error);
      });

  }
};
