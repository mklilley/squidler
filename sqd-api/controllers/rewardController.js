'use strict';

var Promise = require('bluebird');
var crypto = require('crypto');

var api  = Api();
var secrets = Config('reward.SECRET');
var credits = Config('reward.CREDITS');
var Reward = Model('Reward');
var User = Model('User');
var Stats = Model('Stats');

var RewardController = {
    vungle      : Promise.coroutine(vungle),
    info      : Promise.coroutine(info)

}
/////////////////////////////////////
function* vungle(platform, username,transaction_id,provided_hash){

    let secret = secrets.vungle[platform];

    let timestamp = parseInt(transaction_id.split(":")[1], 10) || null;

    // I think the isRecent and exists should perhaps go into middleware, what do you think Nick?
    let valid =  (yield Reward.isRecent(timestamp)) &&  !(yield Reward.exists({by:{transaction:transaction_id}})) &&
        createSecurityDigest(secret, transaction_id) === provided_hash;

    if(valid){

        let reward = new Reward({transaction:transaction_id, username:username, advertiser:"vungle"});
        yield reward.save();

        let now = Math.round(new Date().getTime()/1000);

        yield User.set({by:{username:username}, target:'rewards', data:{[reward.id]: now}});
        yield User.set({by:{username:username}, target:"credits", data:credits, action:"incr"});

        yield Stats.set({by:{name:"reward"}, target:"createdOn", data:{[endOfDaySec()]:1}, action:"incr"});
        yield Stats.set({by:{name:"reward"}, target:"total", data:1, action:"incr"});
    }


    return;

    /////////////////////////////////////


    function createSecurityDigest(secret, transaction_id) {
        var firsthash = crypto.createHash("sha256").update(secret + ":" + transaction_id).digest("binary");
        let hash =  crypto.createHash("sha256").update(firsthash,"binary").digest("hex");
        return hash;
    }



}


function* info(){
    return {credits:credits};
}













///////////////////////////////////////////////////////////////////


module.exports.controller = RewardController;
