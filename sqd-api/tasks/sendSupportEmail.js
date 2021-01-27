'use strict';

exports.sendSupportEmail = {
  name:          'sendSupportEmail',
  description:   'Send a support email to the Squidler support team',
  frequency:     0,
  queue:         'default',
  plugins:       [],
  pluginOptions: [],

  run: function(api, params, next){

      // We'll need to change the login email address to support email address
    let mailOptions = {
        from: '"The Squidler Team" <support@squidler.com>', // sender address
        to: "support@squidler.com", // list of receivers
        subject: 'Support for ' + params.email, // Subject line
        text: 'Name: ' + params.name +'\n\n Email: ' + params.email + '\n\n Message: ' + params.message
    };

    api.email.send('support',mailOptions)
        .then(() => {
          api.log('support email sent');
          next();
        })
        .catch((error) => {
          next(error);
        });
  }
};
