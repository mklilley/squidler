'use strict';

var Promise = require('bluebird');

var api  = Api();

var AdminMiddleware = {
    name         : "isAdmin",
    global       : false,
    priority     : 103,
    preProcessor : Promise.coroutine(preProcessor)
}

    /////////////////////////////////////

    function* preProcessor(data,next) {

        if(data.isAdmin){
            next();
        }
        else{
            next(new SqdError({message:"Sorry, you are not authorised to do this",code:403}));
        }

    }






///////////////////////////////////////////////////////////////////


module.exports.middleware = AdminMiddleware;
