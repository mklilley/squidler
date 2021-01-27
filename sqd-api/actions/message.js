'use strict';

exports.messageGet = {
    name:                   'messageGet',
    description:            'I get messages for users (debug)',
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

        data.response.success = true;
        data.response.message = [];
        next();

    }
};
