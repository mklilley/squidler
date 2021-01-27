
'use strict';

exports.rewardVungle = {
    name:                   'rewardVungle',
    description:            'I reward a user after watching a Vungle video ad (debug)',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             [],

    inputs: {
        uid:{
            required:true,
            validator: ['api.validator.string']
        },
        txid:{
            required:true,
            validator:['api.validator.string']
        },
        digest:{
            required:true,
            validator: ['api.validator.string']
        },
        platform:{
            required:true,
            validator: ['api.validator.string']
        }
    },

    run: function(api, data, next) {


        api.reward.vungle(data.params.platform, data.params.uid, data.params.txid, data.params.digest)
            .then(() => {
                data.response.success = true;
                next();
            })
            .catch(error => {
                next(error);
            });
    }
};



///////////////////////////////////////////////////////////


exports.rewardInfo = {
    name:                   'rewardInfo',
    description:            'I provide information to the user about rewards (debug)',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             ['blockGuest'],

    inputs: {
    },

    run: function(api, data, next) {


        api.reward.info()
            .then(info => {
                data.response.success = true;
                data.response.reward = info;
                next();
            })
            .catch(error => {
                next(error);
            });
    }
};
