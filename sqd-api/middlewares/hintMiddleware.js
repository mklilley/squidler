'use strict';

var Promise = require('bluebird');

var api  = Api();
var User = Model('User');
var Squidle = Model('Squidle');
var costPerHint = Config('squidle.costPerHint');


var HintMiddleware = {
    name         : "hintValidator",
    global       : false,
    priority     : 103,
    preProcessor : Promise.coroutine(preProcessor)
}

    /////////////////////////////////////

    function* preProcessor(data,next) {

        let enoughCredits = data.authUser.credits >= costPerHint;

        let squidle = yield Squidle.get({by:{short:data.params.short}, only:["hints"]});
        let hintsOn = yield Squidle.getBit({by:{short:data.params.short}, target:"state", only:["hintsOn"]});


        if(hintsOn || data.isAdmin){
            if(enoughCredits || data.isAdmin){
                if(Object.keys(squidle.hints).length === (data.authUser.hints ||{})[data.params.short]){
                    next(new SqdError({message:"hintValidator: Sorry, you have reached the maximum number of hints for this Squidle",code:403}));
                }
                else{
                    next();
                }

            }
            else{

                next(new SqdError({message:"hintValidator: Sorry, you don't have enough credits to buy any hints",code:403}));
            }
        }
        else{
            next(new SqdError({message:"hintValidator: Sorry, This creator of this Squidle has disabled hints",code:403}));
        }




}


///////////////////////////////////////////////////////////////////


module.exports.middleware = HintMiddleware;
