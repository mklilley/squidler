'use strict';

var Promise = require('bluebird');

var api  = Api();
var User = Model('User');
var Squidle = Model('Squidle');


var SquidleMiddleware = {
    name         : "squidleValidator",
    global       : false,
    priority     : 103,
    preProcessor : Promise.coroutine(preProcessor)
}

    /////////////////////////////////////

    function* preProcessor(data,next) {

        try{
            //Doing it this way will mean we will end up getting the data twice when we want to modify a squidle for example.
            let squidle = yield Squidle.get({by:{short:data.params.short}, only:["op"]});
            let auth = data.authUser.username.toLowerCase() === squidle.op.toLocaleLowerCase() || data.isAdmin;

            if(auth){
                next();
            }
            else{
                //We probably want a model for this but wasnt sure so i just wanted to write something so i wouldnt forget that we want to log people who are trying to modify other peoples Squidles
                   next(new SqdError({message:"squidleValidator: You are not authorised to do this",code:403}));
            }
        }
        catch(badShort){
            //We probably want a model for this but wasnt sure so i just wanted to write something so i wouldnt forget that we want to log people who are trying to get in with fake tokens
              next(badShort);
        }





    }






///////////////////////////////////////////////////////////////////


module.exports.middleware = SquidleMiddleware;
