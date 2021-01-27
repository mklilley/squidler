
'use strict';

exports.userUsernameExists = {
  name:                   'userUsernameExists',
  description:            'I check a username exists (debug)',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  middleware:             ['blockGuest'],

  inputs: {
      username : {
          required:true, 
          validator: ['api.validator.string','api.validator.username'],
          formatter: ['api.formatter.removeWhiteSpace']
    }
  },

  run: function(api, data, next) {

    api.user.exists({username:data.params.username})
        .then(exists => {
          data.response.success = true;
            data.response.username={exists:exists};
          next();
        })
        .catch(error => {
          next(error);
        });
  }
};



///////////////////////////////////////////////////////////////////

exports.userEmailExists = {
    name:                   'userEmailExists',
    description:            'I check an email exists (debug)',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             [],

    inputs: {
        email : {
            required:true,
            validator: ['api.validator.string'],
            formatter: ['api.formatter.removeWhiteSpace','api.formatter.lowercase','api.formatter.hash']
        }
    },

    run: function(api, data, next) {

        api.user.exists({email:data.params.email})
            .then(exists => {
                data.response.success = true;
                data.response.email={exists:exists};
                next();
            })
            .catch(error => {
                next(error);
            });
    }
};



///////////////////////////////////////////////////////////////////

exports.userUsernameCreate = {
  name:                   'userUsernameCreate',
  description:            'I create a username (debug)',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  middleware:             ["blockGuest"],

  inputs: {
    username: {
      required: true,
        validator: ['api.validator.string','api.validator.username'],
        formatter: ['api.formatter.removeWhiteSpace']
    }
  },

  run: function(api, data, next) {

      let authUser = data.authUser;
      let username = data.params.username;

      if(authUser.username){
          data.response.success = true;
          data.response.username = authUser.username;
          next();
      }
      else{
          api.user.createUsername(authUser,username)
              .then( (username) => {
                  data.response.success = true;
                  data.response.username = username;
                  next();
              })
              .catch(error => {
                  next(error);
              });
      }


  }
};



///////////////////////////////////////////////////////////////////


exports.userUsernameGet = {
    name:                   'userUsernameGet',
    description:            'I get a username (debug)',
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
        data.response.username = data.authUser.username;
        next();

    }
};



///////////////////////////////////////////////////////////////////

exports.userUsernameUpdate = {
    name:                   'userUsernameUpdate',
    description:            'I update the username of a user (debug)',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             ["blockGuest","isAdmin"],

    inputs: {
        username: {
            required: true,
            validator: ['api.validator.string','api.validator.username'],
            formatter: ['api.formatter.removeWhiteSpace']
        },
        newUsername: {
            required: true,
            validator: ['api.validator.string','api.validator.username'],
            formatter: ['api.formatter.removeWhiteSpace']
        }
    },

    run: function(api, data, next) {


        api.user.updateUsername(data.params.username,data.params.newUsername)
            .then( username => {
                data.response.success = true;
                data.response.username = username;
                next();
            })
            .catch(error => {
                next(error);
            });
    }
};

///////////////////////////////////////////////////////////////////

exports.userProfileGet = {
    name:                   'userProfileGet',
    description:            'I get a profile (debug)',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             [],

    inputs: {
        username : {
            required:true,
            validator: ['api.validator.string','api.validator.username'],
            formatter: ['api.formatter.removeWhiteSpace']
        }
    },

    run: function(api, data, next) {


        api.user.getProfile(data.params.username)
            .then(profile => {
                data.response.success = true;
                data.response.profile = profile;
                next();
            })
            .catch(error => {
                next(error);
            });
    }
};



///////////////////////////////////////////////////////////////////

exports.userProfileUpdate = {
    name:                   'userProfileUpdate',
    description:            'I update a profile (debug)',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             ["blockGuest","userValidator"],

    inputs: {
        username: {
            required: true,
            validator: ['api.validator.string','api.validator.username'],
            formatter: ['api.formatter.removeWhiteSpace']
        },
        avatar : {
            required : false,
            validator: ['api.validator.string']
        },
        bio : {
            required : false,
            validator: ['api.validator.string']
        },
        name : {
            required : false,
            validator: ['api.validator.string']
        },
        location :{
            required : false,
            validator: ['api.validator.string']
        }
    },

    run: function(api, data, next) {

        let profileData = {};

        // deleting these unwanted keys seems a bit ugly to me
        Object.assign(profileData, data.params);
        delete profileData.action;
        delete profileData.apiVersion;
        delete profileData.username;


        api.user.updateProfile(data.params.username,profileData)
            .then( profile => {
                data.response.success = true;
                data.response.profile = profile;
                next();
            })
            .catch(error => {
                next(error);
            });
    }
};


///////////////////////////////////////////////////////////////////

exports.userHistoryGet = {
    name:                   'userHistoryGet',
    description:            'I get a users Squidle history (debug)',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             ["blockGuest","userValidator"],

    inputs: {
        username:{
            required:true,
            validator: ['api.validator.string','api.validator.username'],
            formatter: ['api.formatter.removeWhiteSpace']
        }
    },

    run: function(api, data, next) {


        api.user.getHistory(data.params.username)
            .then(history => {
                data.response.success = true;
                data.response.history = history;
                next();
            })
            .catch(error => {
                next(error);
            });
    }
};




///////////////////////////////////////////////////////////////////

exports.userHistoryDelete = {
    name:                   'userHistoryDelete',
    description:            'I delete an entry in a users Squidle history (debug)',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             ["blockGuest"],

    inputs: {
        short : {
            required:true,
            validator: ['api.validator.string']
        },
        username: {
            required: false,
            validator: ['api.validator.username'],
            formatter: ['api.formatter.removeWhiteSpace']
        }
    },

    run: function(api, data, next) {

        let username;
        if(data.isAdmin){
            username =  data.params.username ? data.params.username : data.authUser.username;
        }
        else{
            username =  data.authUser.username;
        }


        api.user.destroyHistory(data.params.short,username)
            .then( () => {
                data.response.success = true;
                next();
            })
            .catch(error => {
                next(error);
            });
    }
};





///////////////////////////////////////////////////////////////////

exports.userCreditsCreate = {
    name:                   'userCreditsCreate',
    description:            'I create credits for a user (debug)',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             ["blockGuest"],

    inputs: {
        receipt: {
            required: true,
            validator: ['api.validator.nonEmptyObject']
        },
        username: {
            required: false,
            validator: ['api.validator.username'],
            formatter: ['api.formatter.removeWhiteSpace']
        }
    },

    run: function(api, data, next) {

        let receipt = data.params.receipt;

        let username;
        let verify;
        if(data.isAdmin){
            username =  data.params.username ? data.params.username : data.authUser.username;
            verify = false;
        }
        else{
            username =  data.authUser.username;
            verify = true;
        }

        api.user.createCredits(receipt, username, verify)
            .then( () => {
                data.response.success = true;
                next();
            })
            .catch(error => {
                next(error);
            });
    }
};

///////////////////////////////////////////////////////////////////

exports.userCreditsGet = {
    name:                   'userCreditsGet',
    description:            'I get the number of credits a user has left (debug)',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             ["blockGuest","userValidator"],

    inputs: {
        username : {
            required:true,
            validator: ['api.validator.username'],
            formatter: ['api.formatter.removeWhiteSpace']
        }
    },

    run: function(api, data, next) {



        api.user.getCredits(data.params.username)
            .then(credits => {
                data.response.success = true;
                data.response.credits = {number:credits};
                next();
            })
            .catch(error => {
                next(error);
            });
    }
};


///////////////////////////////////////////////////////////////////

exports.userReceiptsGet = {
    name:                   'userReceiptsGet',
    description:            'I get the receipts from a users purchase history (debug)',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             ["blockGuest","userValidator"],

    inputs: {
        username : {
            required:true,
            validator: ['api.validator.username'],
            formatter: ['api.formatter.removeWhiteSpace']
        }
    },

    run: function(api, data, next) {


        api.user.getReceipts(data.params.username)
            .then(receipts => {
                data.response.success = true;
                data.response.receipts = receipts;
                next();
            })
            .catch(error => {
                next(error);
            });
    }
};



///////////////////////////////////////////////////////////////////

exports.userDelete = {
    name:                   'userDelete',
    description:            'I delete a user (debug)',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             ["blockGuest","isAdmin"],

    inputs: {
        username : {
            required:true,
            validator: ['api.validator.username'],
            formatter: ['api.formatter.removeWhiteSpace']
        }
    },

    run: function(api, data, next) {


        api.user.destroy(data.params.username)
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

exports.userRewardDelete = {
    name:                   'userRewardDelete',
    description:            'I delete a reward from a user (debug)',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             ["blockGuest","isAdmin"],

    inputs: {
        transaction : {
            required:true,
            validator: ['api.validator.string']
        }
    },

    run: function(api, data, next) {


        api.user.destroyReward(data.params.transaction)
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

exports.userReceiptDelete = {
    name:                   'userReceiptDelete',
    description:            'I delete a receipt from a user (debug)',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             ["blockGuest","isAdmin"],

    inputs: {
        id : {
            required:true,
            validator: ['api.validator.string']
        }
    },

    run: function(api, data, next) {


        api.user.destroyReceipt(data.params.id)
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

exports.UserBan = {
    name:                   'UserBan',
    description:            'I ban a user (debug)',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             ["blockGuest","isAdmin"],

    inputs: {
        username : {
            required:true,
            validator: ['api.validator.username'],
            formatter: ['api.formatter.removeWhiteSpace']
        },
        ban :{
            required:false,
            validator: ['api.validator.boolean']
        }
    },

    run: function(api, data, next) {

      api.user.ban(data.params.username,data.params.ban)
            .then(() => {
                data.response.success = true;
                next();
            })
            .catch(error => {
                next(error);
            });
    }
};