'use strict';

var Promise = require('bluebird');


var api  = Api();
var Auth = Model('Auth');
var redis = Redis();
var models = {
    File:Model('File'),
    User:Model('User'),
    Squidle:Model('Squidle'),
    Receipt:Model('Receipt'),
    Reward:Model('Reward'),
    Auth:Model('Auth')
};
var mongoose = require("mongoose");



var UtilController = {
    flush: Promise.coroutine(flush),
    baseAction: Promise.coroutine(baseAction),
    system: Promise.coroutine(system)

}

    /////////////////////////////////////


function* flush(token){

        if(token !==undefined){
            let auth =  yield Auth.exists({by:{token:token}});
            if(auth){
            let nodes = redis.nodes('master');
            yield Promise.all(nodes.map(function (node) {
                return node.flushdb();
            }));
                return {message:"Database has been flushed"};
            }
            else{
                return Promise.reject("Unable to flush the database: token provided not valid");
            }

        }
        else{
            let exp = Math.floor(Date.now() /1000)+60;
            let auth = new Auth();
            yield auth.generateToken();
            yield auth.save({exp:exp});
            return {message:"You are trying to flush the database - If you are sure you want to do this then resubmit your request with the attached authorisation token", token: auth.token};
        }


}


function* baseAction(params){

    let model = params.model;
    let method = params.method;
    let byKey = params.byKey;
    let byValue = params.byValue;
    let data;

    if(method === "get"){
        data = yield models[model][method]({by:{[byKey]:byValue}});
    }
    else if(method === "getBit"){
         data = yield models[model][method]({by:{[byKey]:byValue}, target:params.target, only:params.only});
    }
    else{
        throw new SqdError({message:method + " is now allowed",code:400});
    }


    return data;

}


function* system(){

    let info = {redis:[]};

    let masters = redis.nodes('master');
    for(let node of masters) {
        info.redis.push(yield node.info());
    }

    info.mongodb = yield mongoose.connection.db.stats();

   return info

}







///////////////////////////////////////////////////////////////////


module.exports.controller = UtilController;
