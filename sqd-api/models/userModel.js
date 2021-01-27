'use strict';

var Promise = require('bluebird');
var crypto = require('crypto');
var base62 = require('base-x')('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
var randomBytes = Promise.promisify(crypto.randomBytes);

var api = Api();
var Base = Model('Base');
var REDIS_PREFIX = Config('user.REDIS_PREFIX');
var INITAL_CREDITS = Config('user.INITIAL_CREDITS');
var redis = Redis();

var clonable = {};


var modelSchema = {
    email: {
        type:'string',
        searchable:{caseSensitive:true},
        enumerable:true,
        gettable:true,
        default:undefined
    },
    token: {
        type:'string',
        searchable:{caseSensitive:true},
        enumerable:true,
        gettable:true,
        default:undefined
    },
    username: {
        type:'string',
        searchable:{caseSensitive:false},
        enumerable:true,
        gettable:true,
        default:undefined
    },
    ip: {
        type:'string',
        enumerable:true,
        gettable:true,
        default:""
    },
    profile: {
        type:'hash',
        enumerable:true,
        gettable:true,
        default:{"name":"","bio":"","avatar":"","location":""}
    },
    recv:{
        type:'oset',
        enumerable:true,
        gettable:true,
        default:undefined
    },
    sent:{
        type:'oset',
        enumerable:true,
        gettable:true,
        default:undefined
    },
    credits:{
        type:'string',
        enumerable:true,
        gettable:true,
        default:INITAL_CREDITS
    },
    state:{
        type:'bitmap',
        enumerable:true,
        gettable:false,
        offset: {isAdmin: 0, isBanned:1},
        default: []
    },
    hints: {
        type:'oset',
        enumerable:true,
        gettable:true,
        default:undefined
    },
    receipts: {
        type:'oset',
        enumerable:true,
        gettable:true,
        default:undefined
    },
    rewards: {
        type:'oset',
        enumerable:true,
        gettable:true,
        default:undefined
    },
    date:{
        type:'string',
        enumerable:true,
        gettable:true,
        default: (()=>{let date = new Date();
            date.setDate(date.getDate());
            return Math.floor(date.getTime()/1000);})
    }

};

class User extends Base{

    constructor(data){


        super(modelSchema,data,{});



    }



}

User.prototype.generateToken    = Promise.coroutine(generateToken);
User.prototype.cleanHistory   = Promise.coroutine(cleanHistory);
User.logoutAll = Promise.coroutine(logoutAll);
User.model               =  Promise.coroutine(model);
User.prototype.model    = Promise.coroutine(model);



    /////////////////////////////////////

function* model(){
    return  modelSchema
}


    function* generateToken(){

        let bytes  = parseInt(process.env.SQD_API_TOKEN_BYTES) || 32;
        let token = this.token;

        if(token !== undefined){
             yield redis.del(REDIS_PREFIX + ":getBy:token:{" + token + "}");
        }

         token = yield randomBytes(bytes)
            .then(buf => {
              let token = base62.encode(buf);
              return token;
              //return buf.toString('hex');
            })
            .catch(error => {
              throw new SqdError({message:"User.generateToken: " + error.message,code:500});
            });

        let tokenExists = yield User.exists({by:{token:token}});

        if(tokenExists){
           return yield  Promise.coroutine(generateToken)();
        }
        else{
            this.token = token;
        }

            return;
    }


function* cleanHistory(){

    let now = Math.round(new Date().getTime()/1000);

    yield redis.zremrangebyscore(REDIS_PREFIX + ":{" + this.id + "}:sent", [0,now]);
    yield redis.zremrangebyscore(REDIS_PREFIX + ":{" + this.id + "}:recv", [0,now]);

    return;

}

function* logoutAll(){
  let keys = yield redis.keys(REDIS_PREFIX+":*:token*");
    yield redis.del(keys);
    return;
}







///////////////////////////////////////////////////////////////////

module.exports.model = User;
