'use strict';

exports.infoGet = {
    name:                   'infoGet',
    description:            'I get Squidler info (debug)',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             [],

    inputs: {
        name:{
            required:true,
            validator: ['api.validator.string'],
            formatter: ['api.formatter.removeWhiteSpace', 'api.formatter.lowercase']
        }
    },

    run: function(api, data, next) {

        api.info.get(data.params.name)
            .then(info => {
                data.response.success = true;
                data.response.info = info;
                next();
            })
            .catch(error => {
                next(error);
            });
    }
};

exports.infoCreate = {
    name:                   'infoCreate',
    description:            'I create Squidler info (debug)',
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
        },
        data:{
            required:true,
            validator: ['api.validator.nonEmptyObject']
        }
    },

    run: function(api, data, next) {

        api.info.create(data.params.name,data.params.data)
            .then(info => {
                data.response.success = true;
                data.response.info = info;
                next();
            })
            .catch(error => {
                next(error);
            });
    }
};

exports.infoUpdate = {
    name:                   'infoUpdate',
    description:            'I update Squidler info (debug)',
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
        },
        data:{
            required:true,
            validator: ['api.validator.nonEmptyObject']
        }
    },

    run: function(api, data, next) {

        api.info.update(data.params.name,data.params.data)
            .then(info => {
                data.response.success = true;
                data.response.info = info;
                next();
            })
            .catch(error => {
                next(error);
            });
    }
};



exports.infoDelete = {
    name:                   'infoDelete',
    description:            'I delete info (debug)',
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


        api.info.destroy(data.params.name)
            .then(() => {
                data.response.success = true;
                next();
            })
            .catch(error => {
                next(error);
            });
    }
};