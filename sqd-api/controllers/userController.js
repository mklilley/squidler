'use strict';

var Promise = require('bluebird');
var Request = require('request-promise');

var api  = Api();
var User = Model('User');
var Squidle = Model('Squidle');
var Receipt = Model('Receipt');
var Reward = Model('Reward');
var Stats = Model('Stats');
var File = Model('File');
var infDate = Config('file.INF_DATE');
var fileUpdateRoute = Config('file.UPDATE_ROUTE');
var fileDeleteRoute = Config('file.DELETE_ROUTE');
var fileDeleteRoute = Config('file.DELETE_ROUTE');
var squidsBundle = Config('receipt.SQUIDS_BUNDLE');
var BASE = Config('file.BASE');


var UserController = {
    exists            : Promise.coroutine(exists),
    createUsername    : Promise.coroutine(createUsername),
    updateUsername    : Promise.coroutine(updateUsername),
    createStaticUsers : Promise.coroutine(createStaticUsers),
    getProfile        : Promise.coroutine(getProfile),
    updateProfile     : Promise.coroutine(updateProfile),
    getHistory        : Promise.coroutine(getHistory),
    destroyHistory    : Promise.coroutine(destroyHistory),
    getCredits        : Promise.coroutine(getCredits),
    createCredits     : Promise.coroutine(createCredits),
    getReceipts       :  Promise.coroutine(getReceipts),
    destroy           : Promise.coroutine(destroy),
    destroyReceipt    : Promise.coroutine(destroyReceipt),
    destroyReward     : Promise.coroutine(destroyReward),
    ban               : Promise.coroutine(ban),

};
    /////////////////////////////////////


    function* updateUsername(oldUsername, newUsername){

        let user = yield User.exists({by:{username:newUsername}});

        if(user){
            return Promise.reject("Username " + newUsername + " already taken");
        }
        else{
            yield User.set({by:{username:oldUsername}, target:"username", data:newUsername});
            return newUsername;
        }

    }

    function* createUsername(authUser,username){


                let user = yield User.exists({by:{username:username}});
                 if(user){
                     return Promise.reject("Username " + username + " already taken");
                 }
                  else{
                     authUser.username = username;
                     yield authUser.save();
                     return username;
                 }

    }


    function* exists(userIdentifier){

            return yield User.exists({by:userIdentifier});

    }


    // I am not sure that here is the best place to be  creating guest user on the database
    function* createStaticUsers(){
        let guest;
        let squidlerTeam;
        let admin;

        let guestExists = yield User.exists({by:{username:"guest"}});

        if(!guestExists){
            guest = new User({username:"guest"});
            yield guest.save();
        }


        let squidlerTeamExists = yield User.exists({by:{username:"SquidlerTeam"}});

        if(!squidlerTeamExists){
            squidlerTeam = new User({username:"SquidlerTeam", profile:{bio:"We Love to Squidle",avatar:"",name:"Squidler Team",location:"London"} });
           yield squidlerTeam.save();
        }

        let adminExits = yield User.exists({by:{username:"admin"}});

        if(!adminExits){
            admin = new User({username:"admin"});
            yield admin.generateToken();
            yield admin.save();
            yield User.setBit({by:{username:"admin"}, target:"state", one:["isAdmin"]});
        }

        return

    }


    function* getProfile(username){

        let user = yield User.get({by:{username:username}, only:["profile"]});
        return user.profile;

    }


    function* updateProfile(username,data){

        if("avatar" in data) {
            let user = yield User.get({by: {username: username}, only: [["profile", "avatar"]]});
            let admin = yield User.get({by:{username:"admin"}, only:["token"]});

            let oldAvatar = user.profile.avatar;

            let isSquidlerAvatar = data.avatar.indexOf(BASE) !== -1;

            if (isSquidlerAvatar) {
                let start = data.avatar.lastIndexOf('/') + 1;
                let end = data.avatar.lastIndexOf('.');
                let filename = data.avatar.slice(start, end);

                let fileExists = yield File.exists({by:{name: filename}});

                if(fileExists) {
                    //
                    // let options = {
                    //     uri: fileUpdateRoute + filename,
                    //     method:"POST",
                    //     json: true,
                    //     body: {expiry:infTimeSec},
                    //     headers:{
                    //         Token:admin.token
                    //     }
                    // };

                   //data.avatar = yield api.file.setExpiry(filename,infTimeSec);
                    //let response = yield Request(options);

                    //yield File.setExpiry({by:{filename:newFilename}, at:timeSec});
                    yield File.set({by:{name:filename}, target:"expiresAt", data:infDate});
                    //data.avatar = response.file;
                }

            }

            yield User.set({by:{username:username}, target:"profile", data:data});


            //now remove old file

            isSquidlerAvatar = oldAvatar.indexOf(BASE) !== -1;

            if (isSquidlerAvatar) {

                let start = oldAvatar.lastIndexOf('/') + 1;
                let end = oldAvatar.lastIndexOf('.');
                let filename = oldAvatar.slice(start, end);

                let fileExists = yield File.exists({by:{name: filename}});

                if(fileExists) {
                   yield File.destroy({by:{name: filename}});
                }

            }





        }

        else{
            yield User.set({by:{username:username}, target:"profile", data:data});
        }


        return data;


    }


    function* getHistory(username) {

        let now = Math.round(new Date().getTime()/1000);

        let user = yield User.get({by:{username:username}, only:[["sent",now,"+inf"],["recv",now,"+inf"]]});


        let history = Object.keys(user.sent||{}).concat(Object.keys(user.recv||{}));


        return history


    }


    function* destroyHistory(short,username) {

        yield User.destroy({by:{username:username}, only:[["recv",short]]});
        return;


    }


    function* getCredits(username){

        let user = yield  User.get({by:{username:username}, only:["credits"]});

        return user.credits;

    }

    function* createCredits(vendorReceipt,username,verify){

        verify = verify!==undefined ? verify : true;

        let now = Math.round(new Date().getTime()/1000);

        let receipt = new Receipt({username: username, details: vendorReceipt, credits:squidsBundle});

        if(verify) {

            yield receipt.verify();

            yield Stats.set({by:{name:"receipt"}, target:"createdOn", data:{[endOfDaySec()]:1}, action:"incr"});
            yield Stats.set({by:{name:"receipt"}, target:"total", data:1, action:"incr"});

        }

        yield receipt.save();

        yield User.set({by: {username: username}, target: "receipts", data: {[receipt.id]: now}});

        yield User.set({by:{username:username}, target:"credits", data:squidsBundle, action:"incr"});


        return;

    }


function* getReceipts(username){

    let user = yield  User.get({by:{username:username}, only:["receipts"]});

    let receiptIds = Object.keys(user.receipts ||{});

    let receipts = [];

    for (let id of receiptIds) {
        let receipt = yield Receipt.get({by:{id:id}, except:["details","username"]});
        delete receipt.details;
        delete receipt.username;
        receipts.push(receipt);


    }


    return receipts;

}

function* destroy(username){
    let user = yield User.get({by:{username:username}, only:["receipts","rewards","profile"]});
    let admin = yield User.get({by:{username:"admin"}, only:["token"]});

    let receiptIds = Object.keys(user.receipts ||{});
    let rewardIds = Object.keys(user.receipts ||{});

    for(let id of receiptIds){
        yield Receipt.destroy({by:{id:id}});
    }
    for(let id of rewardIds){
        yield Reward.destroy({by:{id:id}});
    }

    let avatar = user.profile.avatar;

    let isSquidlerAvatar = avatar.indexOf(BASE) !== -1;

    if (isSquidlerAvatar) {

        let start = avatar.lastIndexOf('/') + 1;
        let end = avatar.lastIndexOf('.');
        let filename = avatar.slice(start, end);

        let fileExists = yield File.exists({by:{name: filename}});

        if(fileExists) {
            yield File.destroy({by:{name: filename}});
        }

    }


    yield User.destroy({by:{username:username}});

    return;

}

function* destroyReceipt(id){
    yield Receipt.destroy({by:{id:id}});
    return;
}

function* destroyReward(transaction){
    yield Reward.destroy({by:{transaction:transaction}});
    return;
}


function* ban(username, ban){

    ban = ban!==undefined ? ban : true;

    if(ban){
        yield User.setBit({by:{username:username}, target:"state", one:["isBanned"]});
    }
    else{
        yield User.setBit({by:{username:username}, target:"state", zero:["isBanned"]});
    }

    return;
}













///////////////////////////////////////////////////////////////////


module.exports.controller = UserController;
