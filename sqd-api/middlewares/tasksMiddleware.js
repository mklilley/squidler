'use strict';

var Promise = require('bluebird');

var api  = Api();
var User = Model('User');

var TasksMiddleware = {
    name         : "tasks",
    global       : true,
    priority     : 101,
    preProcessor : Promise.coroutine(preProcessor)
}

    /////////////////////////////////////

    function* preProcessor(data,next) {

        if(!data.isGuest){
            yield User.set({by:{token:data.authUser.token}, target:"ip", data:data.connection.remoteIP});
            yield data.authUser.cleanHistory();
        }

        next();

    }






///////////////////////////////////////////////////////////////////


module.exports.middleware = TasksMiddleware;
