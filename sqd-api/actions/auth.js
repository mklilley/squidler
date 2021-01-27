
'use strict';

exports.authLogin = {
  name:                   'authLogin',
  description:            'Log in/ Sign up the user',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  middleware:             [],

  inputs: {
    email: {
      required: true,
      validator: ['api.validator.email'],
      formatter: ['api.formatter.removeWhiteSpace','api.formatter.lowercase']
    }
  },

  run: function(api, data, next) {
    api.auth.login(data.params.email)
        .then(() => {
          data.response.success = true;
          next();
        })
        .catch(error => {
          next(error);
        });
  }
};


///////////////////////////////////////////////////////////////////



exports.authVerify = {
  name:                   'authVerify',
  description:            'Authorise a user from verify link sent to their email address',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  middleware:             [],

  inputs: {
    token: {
      required: true,
      validator: ['api.validator.token'],
      formatter: ['api.formatter.removeWhiteSpace']
    }
  },

  run: function(api, data, next) {
    api.auth.verify(data.params.token)
        .then((token) => {
          data.response.success = true;
          data.response.auth = token;
          next();
        })
        .catch(error => {
          next(error);
        });
  }
};




///////////////////////////////////////////////////////////////////



exports.authVerifyRedirect = {
  name:                   'authVerifyRedirect',
  description:            'I redirect a user from who tries to do a GET on verify route',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  middleware:             [],

  inputs: {
    token:{
      required:true,
      validator:['api.validator.token'],
      formatter: ['api.formatter.removeWhiteSpace']
    }
    },

  run: function(api, data, next) {

    data.connection.rawConnection.responseHeaders.push(['Location', process.env.SQD_VERIFY_BASE + "/" + "verify.html?token="+data.params.token]);
    data.connection.rawConnection.responseHttpCode = 302;

    next();
  }
};

////////////////////////////////////////////////////////////////


exports.authLogout = {
  name:                   'authLogout',
  description:            'Logout a user',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  middleware:             ["blockGuest","isAdmin"],

  inputs: {
    username: {
      required: false,
      validator: ['api.validator.string','api.validator.username'],
      formatter: ['api.formatter.removeWhiteSpace']
    },
    token:{
      required: false,
      validator:['api.validator.token'],
      formatter: ['api.formatter.removeWhiteSpace']
    }
  },

  run: function(api, data, next) {
    api.auth.logout(data.params.username, data.params.token)
        .then(result => {
          data.response.success = true;
          data.response.message = result.message;
          if("token" in result){ data.response.token = result.token;}
          next();
        })
        .catch(error => {
          next(error);
        });
  }
};

