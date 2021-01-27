'use strict';

var Promise = require('bluebird');

var api  = Api();
var User = Model('User');
var Squidle = Model('Squidle');
var costPerCharacter = Config('squidle.costPerCharacter');


var UpdateSquidleMiddleware = {
    name         : "updateSquidleValidator",
    global       : false,
    priority     : 104,
    preProcessor : Promise.coroutine(preProcessor)
}

    /////////////////////////////////////

    function* preProcessor(data,next) {

        let squidle = yield Squidle.get({by:{short:data.params.short}, only:["answer"]});

        let updatable = yield Squidle.getBit({by:{short:data.params.short}, target:"state", only:["updatable"]});

        let hintsOn = yield Squidle.getBit({by:{short:data.params.short}, target:"state", only:["hintsOn"]});

        if(updatable || data.isAdmin){

            if(data.params.hintsOn!==undefined && data.params.hintsOn!==hintsOn){
                if(data.params.hintsOn===0) {
                    let cost = squidle.answer.replace(/ /gi, "").length * costPerCharacter;

                    let enoughCredits = data.authUser.credits >= cost;

                    if (enoughCredits || data.isAdmin) {
                        data.cost = cost;
                        next();
                    }
                    else {

                        next(new SqdError({
                            message: "updateSquidleValidator: Sorry, you don't have enough credits to disable hints for your Squidle",
                            code: 403
                        }));
                    }
                }
                else{
                    if(data.isAdmin){
                        next();
                    }
                    else{
                        next(new SqdError({message:"updateSquidleValidator: You are not authorised to do this",code:403}));
                    }
                }
            }
            else{
                next();
            }
        }
        else{
            next(new SqdError({message:"updateSquidleValidator: Sorry, Squidle with short = " + data.params.short + " has already been viewed. Updates no longer allowed",code:403}));
        }







}


///////////////////////////////////////////////////////////////////


module.exports.middleware = UpdateSquidleMiddleware;
