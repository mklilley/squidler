'use strict';

exports.getStats = {
    name:                   'getStats',
    description:            'I get Squidler stats (debug)',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             ["blockGuest","isAdmin"],

    inputs: {
        model:{
            required:false,
            validator: ['api.validator.string'],
            formatter: ['api.formatter.removeWhiteSpace', 'api.formatter.lowercase']
        }
    },

    run: function(api, data, next) {


        api.stats.stats(data.params.model)
            .then(stats => {
                data.response.success = true;
                data.response.stats = stats;
                next();
            })
            .catch(error => {
                next(error);
            });
    }
};


exports.getAgg = {
    name:                   'getAgg',
    description:            'I aggregate models from the database over time (debug)',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             ["blockGuest","isAdmin"],

    inputs: {
        model:{
            required:false,
            validator: ['api.validator.string'],
            formatter: ['api.formatter.removeWhiteSpace', 'api.formatter.lowercase']
        }
    },

    run: function(api, data, next) {


        api.stats.aggregate(data.params.model)
            .then(agg => {
                data.response.success = true;
                data.response.agg = agg;
                next();
            })
            .catch(error => {
                next(error);
            });
    }
};


exports.statsDelete = {
    name:                   'statsDelete',
    description:            'I delete stats (debug)',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             ["blockGuest","isAdmin"],

    inputs: {
        name:{
            required:true,
            validator: ['api.validator.string'],
            formatter: ['api.formatter.removeWhiteSpace', 'api.formatter.lowercase']
        }
    },

    run: function(api, data, next) {


        api.stats.destroy(data.params.name)
            .then(() => {
                data.response.success = true;
                next();
            })
            .catch(error => {
                next(error);
            });
    }
};