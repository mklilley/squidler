'use strict';

var Promise = require('bluebird');

var api = Api();
var Base = Model('Base');
var REDIS_PREFIX = Config('auth.REDIS_PREFIX');
var redis = Redis();
var crypto = require('crypto');
var base62 = require('base-x')('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
var randomBytes = Promise.promisify(crypto.randomBytes);

var clonable = {};


var modelSchema = {
    token: {
        type:'string',
        searchable:{caseSensitive:true},
        enumerable:true,
        gettable:true,
        default:undefined
    }
};


class Auth extends Base {

    constructor(data) {



        super(modelSchema,data,{});


    }


}


Auth.prototype.model    = Promise.coroutine(model);
Auth.prototype.generateToken    = Promise.coroutine(generateToken);
Auth.model    = Promise.coroutine(model);



    /////////////////////////////////////

function* model(){
    return  modelSchema
}

function* generateToken(){

    let bytes  = parseInt(process.env.SQD_API_TOKEN_BYTES) || 32;
    let token;

    if(this.token !== undefined){
        throw new SqdError({message:"Auth.generateToken: token already generated for this Auth",code:500});
    }

    token = yield randomBytes(bytes)
        .then(buf => {
            let token = base62.encode(buf);
            return token;
            //return buf.toString('hex');
        })
        .catch(error => {
            throw new SqdError({message:"Auth.generateToken: " + error.message,code:500});
        });

    let authExists = yield Auth.exists({by:{token:token}});

    if(authExists){
        return yield Promise.coroutine(generateToken)();
    }
    else{
        this.token = token;
    }

    return;


}


///////////////////////////////////////////////////////////////////

module.exports.model = Auth;
