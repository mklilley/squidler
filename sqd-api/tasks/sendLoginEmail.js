'use strict';

exports.sendLoginEmail = {
  name:          'sendLoginEmail',
  description:   'Send the Sign in / up email to the user',
  frequency:     0,
  queue:         'default',
  plugins:       ['retry'],
  pluginOptions: {
    retry: {
        retryLimit: 5,
        retryDelay: (1000 * 10),
    }
},


  run: function(api, params, next){

      // TODO: Templating
    let mailOptions = {
        from: '"Squidler Team" <login@squidler.com>', // sender address
        to: params.email, // list of receivers
        subject: 'Your one time Squidler login', // Subject line
        text: 'Complete login process!\n\n Your one time token is ' + params.token + '\n\n This will expire in 1 hour', // plaintext body
        html: '<html><head> <meta charset="utf-8"> <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Flamenco"><link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,800,700" rel="stylesheet" type="text/css"> <style>html, body, div,h1, h2, h3, h4, p, a{margin: 0;padding: 0;border: 0;font-size: 100%;font: inherit;vertical-align: baseline;}body{line-height: 1;}</style></head><body style="background-color:#F7F7F7;width:100%;height:100%;"> <div style="width:90%;margin:0 auto 30px auto;overflow:auto;"> <div style="margin-bottom:10px;font-family:\'Open Sans\',arial,sans-serif;font-weight:lighter;font-size:14px;text-align:center;"><h3 style="color:black;font-family:\'Open Sans\',arial,sans-serif;font-weight:lighter;font-size:16px;text-align:center;margin-top:20px">Click to confirm you want to login to Squidler</h3> <div style="text-align:center;align:center;margin-bottom:20px;margin-top:20px;"><a style="text-decoration: none;display:block;background-color:#FF6B01;width:450px;max-width:100%; margin:auto;line-height:60px;color:inherit;" href="'+process.env.SQD_BASE+'/api/1/auth/verify/' + params.token + '"><h2 style="color:white;font-family:\'Open Sans\',arial,sans-serif;font-weight:bold;font-size:18px;text-align:center;">Complete Squidler Login</h2> </a> </div><h2 style="margin-bottom:10px;color:black;font-family:\'Open Sans\',arial,sans-serif;font-weight:bold;font-size:16px;text-align:center;">This link will expire in 1 hour</h2><h3 style="margin-bottom:20px;color:black;font-family:\'Open Sans\',arial,sans-serif;font-weight:lighter;font-size:16px;text-align:center;">- The Squidler Team</h3> </div><p style="line-height:24px;font-family:\'Open Sans\',arial,sans-serif;font-weight:lighter;font-size:12px;text-align:center;"> If you did not request a Squidler account, please contact us at <a style="color:black" href="mailto:support@squidler.com"> support@squidler.com</a></p></div><div style="width:100%;background-color:#222224;color:white;line-height:24px;font-family:\'Open Sans\',arial,sans-serif;font-weight:lighter;font-size:12px;text-align:center;"> <p>Sent by <a style="color:white" href="https://squidler.com" target="_blank">Squidler</a> &copy; 2016 Level 8 Limited, All rights reserved</p></div></body></html>'  // html body
    };

    api.email.send('login',mailOptions)
        .then(() => {
          api.log('login email sent', 'info');
          next();
        })
        .catch((error) => {
            // Something very dodgy is happening when i put an error into the next function, so instead we'll just use a string error.
          // next(new SqdError({message:"Problem communicating with Squidler mail server",code:500}));
            //next("Problem communicating with Squidler mail server");
            next(new Error("Problem communicating with Squidler mail server"));
        });
  }
};
