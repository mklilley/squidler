'use strict';

var Promise = require('bluebird');

var api  = Api();
var User = Model('User');

var CreateUsernameValidator = {
    name         : "createusernameValidator",
    global       : false,
    priority     : 103,
    preProcessor : Promise.coroutine(preProcessor)
}

    /////////////////////////////////////

    function* preProcessor(data,next) {


        if(data.authUser.username){
            next(new SqdError({message:"createusernameValidator: Username already set for this user",code:403}));
        }
        else{
            next();
        }


}


///////////////////////////////////////////////////////////////////


module.exports.middleware = CreateUsernameValidator;
