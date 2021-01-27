'use strict';

var Promise = require('bluebird');

var api  = Api();
var User = Model('User');

var AuthMiddleware = {
    name         : "authUser",
    global       : true,
    priority     : 100,
    preProcessor : Promise.coroutine(preProcessor)
}

    /////////////////////////////////////

    function* preProcessor(data,next) {

        let token = data.connection.rawConnection.req.headers.token;
        if(token !== undefined && token !==null){
            try{
                data.authUser = yield User.get({by:{token:token}});
                data.isAdmin = yield User.getBit({by:{token:token}, target:"state", only:['isAdmin']});
                data.isGuest = false;
                let isBanned = yield User.getBit({by:{token:token}, target:"state", only:['isBanned']});
                if(isBanned){
                    next(new SqdError({message:"Your account has been disabled - please contact the Squidler Team for more information",code:403}) );
                }
                else{
                    next();
                }



            }
            catch(badToken){
                //We probably want a model for this but wasnt sure so i just wanted to write something so i wouldnt forget that we want to log people who are trying to get in with fake tokens

                next(new SqdError({message:"Please login again - your user credentials have expired",code:401}) );
            }

        }
        else{
            data.authUser = yield User.get({by:{username:"guest"}});
            data.isGuest = true;
            next();
        }



    }






///////////////////////////////////////////////////////////////////


module.exports.middleware = AuthMiddleware;
