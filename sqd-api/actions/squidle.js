'use strict';

exports.squidleGet = {
    name: 'squidleGet',
    description: 'I get a Squidle (debug)',
    blockedConnectionTypes: [],
    outputExample: {},
    matchExtensionMimeType: false,
    version: 1.0,
    toDocument: true,
    middleware: [],

    inputs: {
        short: {
            required: true,
            validator: ['api.validator.string']
        },
        username: {
            required: false,
            validator: ['api.validator.username'],
            formatter: ['api.formatter.removeWhiteSpace']
        }
    },

    run: function (api, data, next) {

        let username;
        if(data.isAdmin){
            username =  data.params.username ? data.params.username : data.authUser.username;
        }
        else{
            username =  data.authUser.username;
        }


        api.squidle.get(data.params.short, username)
            .then(squidle => {
                data.response.success = true;
                data.response.squidle = squidle;
                next();
            })
            .catch(error => {
                next(error);
            });
    }
};

///////////////////////////////////////////////////////////////////

exports.squidleSolve = {
    name: 'squidleSolve',
    description: 'I solve a Squidle (debug)',
    blockedConnectionTypes: [],
    outputExample: {},
    matchExtensionMimeType: false,
    version: 1.0,
    toDocument: true,
    middleware: [],

    inputs: {
        guess: {
            required: true,
            validator: ['api.validator.string']
        },
        short: {
            required: true,
            validator: ['api.validator.string']
        },
        username: {
            required: false,
            validator: ['api.validator.username'],
            formatter: ['api.formatter.removeWhiteSpace']
        }
    },

    run: function (api, data, next) {

        let username;
        if(data.isAdmin){
            username =  data.params.username ? data.params.username : data.authUser.username;
        }
        else{
            username =  data.authUser.username;
        }

        api.squidle.solve(data.params.short, data.params.guess, username)
            .then(squidle => {
                data.response.success = true;
                data.response.squidle = squidle;
                next();
            })
            .catch(error => {
                next(error);
            });
    }
};

///////////////////////////////////////////////////////////////////

exports.squidleCreate = {
    name: 'squidleCreate',
    description: 'I create a Squidle (debug)',
    blockedConnectionTypes: [],
    outputExample: {},
    matchExtensionMimeType: false,
    version: 1.0,
    toDocument: true,
    middleware: ["blockGuest"],


    inputs: {
        challenge: {
            required: true,
            validator: ['api.validator.nonEmptyObject',function(param){
                if("text" in param){return true;}else{return param + "is not a valid challenge: text question is missing"}
            }],
            formatter: function (param) {
                let newParam = {};
                if(typeof param ==="object") {
                    if ("text" in param) {
                        newParam.text = param.text.value;
                    }
                    if ("photo" in param) {
                        newParam.photo = param.photo.value;
                    }
                    if("video" in param){
                        newParam.video = param.video.value;
                    }
                }
                return newParam;
            }
        },
        prize: {
            required: true,
            validator: ['api.validator.nonEmptyObject'],
            formatter: function (param) {
                let newParam = {};
                if(typeof param ==="object") {
                    if ("text" in param) {
                        newParam.text = param.text.value;
                    }
                    if ("photo" in param) {
                        newParam.photo = param.photo.value;
                    }
                    if("video" in param){
                        newParam.video = param.video.value;
                    }
                }
                return newParam;
            }
        },
        answer: {
            required: true,
            validator: ['api.validator.string'],
            formatter: function (param) {
                let newParam;
                if(typeof param ==="object") {
                    newParam = (param.text||{}).value;
                }
                else{
                    newParam = param;
                }

                return newParam;
            }
        },
        username: {
            required: false,
            validator: ['api.validator.username'],
            formatter: ['api.formatter.removeWhiteSpace']
        }
    },

    run: function (api, data, next) {

        let squidleData = {
            challenge: data.params.challenge,
            prize: data.params.prize,
            answer: data.params.answer
        };

        let username;
        if(data.isAdmin){
            username =  data.params.username ? data.params.username : data.authUser.username;
        }
        else{
            username =  data.authUser.username;
        }

        api.squidle.create(squidleData, username)
            .then(squidle => {
                data.response.success = true;
                data.response.squidle = squidle;
                next();
            })
            .catch(error => {
                next(error);
            });
    }
};


///////////////////////////////////////////////////////////////////

exports.squidleDelete = {
    name: 'squidleDelete',
    description: 'I delete a Squidle (debug)',
    blockedConnectionTypes: [],
    outputExample: {},
    matchExtensionMimeType: false,
    version: 1.0,
    toDocument: true,
    middleware: ["blockGuest", "squidleValidator"],

    inputs: {
        short: {
            required: true,
            validator: ['api.validator.string']
        },
        username: {
            required: false,
            validator: ['api.validator.username'],
            formatter: ['api.formatter.removeWhiteSpace']
        }
    },

    run: function (api, data, next) {

       let username;
        if(data.isAdmin){
            username =  data.params.username ? data.params.username : data.authUser.username;
        }
        else{
            username =  data.authUser.username;
        }


        api.squidle.destroy(data.params.short, username)
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

exports.squidleUpdate = {
    name: 'squidleUpdate',
    description: 'I update a Squidle (debug)',
    blockedConnectionTypes: [],
    outputExample: {},
    matchExtensionMimeType: false,
    version: 1.0,
    toDocument: true,
    middleware: ["blockGuest", "squidleValidator", "updateSquidleValidator"],

    inputs: {
        expiresAt: {
            required: false,
            validator: ['api.validator.expiry'],
            formatter: ['api.formatter.timeSeconds']
        },
        hintsOn: {
            required: false,
            validator: ['api.validator.binary'],
            formatter: ['api.formatter.boolToBinary']
        },
        short: {
            required: true,
            validator: ['api.validator.string']
        },
        username: {
            required: false,
            validator: ['api.validator.username'],
            formatter: ['api.formatter.removeWhiteSpace']
        }
    },

    run: function (api, data, next) {

        let squidleData = {};

        Object.assign(squidleData, data.params);
        delete squidleData.action;
        delete squidleData.apiVersion;

        let username;
        if(data.isAdmin){
            username =  data.params.username ? data.params.username : data.authUser.username;
        }
        else{
            username =  data.authUser.username;
        }

        api.squidle.update(squidleData, data.cost, username)
            .then(squidle => {
                data.response.success = true;
                data.response.squidle = squidle;
                next();
            })
            .catch(error => {
                next(error);
            });
    }
};


///////////////////////////////////////////////////////////////////


exports.squidleStatsGet = {
    name: 'squidleStatsGet',
    description: 'I get the stats for a specific Squidle (debug)',
    blockedConnectionTypes: [],
    outputExample: {},
    matchExtensionMimeType: false,
    version: 1.0,
    toDocument: true,
    middleware: ["blockGuest"],

    inputs: {
        short: {
            required: true,
            validator: ['api.validator.string']
        }
    },

    run: function (api, data, next) {


        api.squidle.getStats(data.params.short)
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


///////////////////////////////////////////////////////////////////


exports.squidleUpdatable = {
    name: 'squidleUpdatable',
    description: 'I check to see if a Squidle can be updated (debug)',
    blockedConnectionTypes: [],
    outputExample: {},
    matchExtensionMimeType: false,
    version: 1.0,
    toDocument: true,
    middleware: ["blockGuest", "squidleValidator"],

    inputs: {
        short: {
            required: true,
            validator: ['api.validator.string']
        }
    },

    run: function (api, data, next) {


        api.squidle.updatable(data.params.short)
            .then(updatable => {
                data.response.success = true;
                data.response.squidle = {updatable: updatable};
                next();
            })
            .catch(error => {
                next(error);
            });
    }
};


///////////////////////////////////////////////////////////////////


exports.squidleHintGet = {
    name: 'squidleHintGet',
    description: 'I get a hint and return it to the client',
    blockedConnectionTypes: [],
    outputExample: {},
    matchExtensionMimeType: false,
    version: 1.0,
    toDocument: true,
    middleware: ["blockGuest", "hintValidator"],

    inputs: {
        short: {
            required: true,
            validator: ['api.validator.string']
        },
        username: {
            required: false,
            validator: ['api.validator.username'],
            formatter: ['api.formatter.removeWhiteSpace']
        }
    },

    run: function (api, data, next) {

        let username;
        if(data.isAdmin){
            username =  data.params.username ? data.params.username : data.authUser.username;
        }
        else{
            username =  data.authUser.username;
        }


        api.squidle.getHint(data.params.short, username)
            .then(hint => {
                data.response.success = true;
                data.response.squidle = hint;
                next();
            })
            .catch(error => {
                next(error);
            });
    }
};