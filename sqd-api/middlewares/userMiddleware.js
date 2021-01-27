'use strict';

var Promise = require('bluebird');

var api  = Api();
var User = Model('User');

var UserMiddleware = {
    name         : "userValidator",
    global       : false,
    priority     : 103,
    preProcessor : Promise.coroutine(preProcessor)
}

    /////////////////////////////////////

    function* preProcessor(data,next) {

        if(data.authUser.username &&  data.params.username) {

            let auth = data.authUser.username.toLowerCase() === data.params.username.toLowerCase() || data.isAdmin;

            if (auth) {
                next();
            }
            else {
                //We probably want a model for this but wasnt sure so i just wanted to write something so i wouldnt forget that we want to log people who are trying to modify other peoples details
                next(new SqdError({message: "userValidator: You are not authorised to do this", code: 403}));
            }
        }
        else{
            next(new SqdError({message: "userValidator: No username provided", code: 403}));
        }


}


///////////////////////////////////////////////////////////////////


module.exports.middleware = UserMiddleware;
