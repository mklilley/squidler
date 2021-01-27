'use strict';

var Promise = require('bluebird');

var api  = Api();

var GuestMiddleware = {
    name         : "blockGuest",
    global       : false,
    priority     : 102,
    preProcessor : Promise.coroutine(preProcessor)
}

    /////////////////////////////////////

    function* preProcessor(data,next) {

        if(data.isGuest){
            next(new SqdError({message:"Guest users are not authorised to do this",code:403}));
        }
        else{
            next()
        }

    }






///////////////////////////////////////////////////////////////////


module.exports.middleware = GuestMiddleware;
