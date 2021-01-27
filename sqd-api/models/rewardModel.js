'use strict';

var Promise = require('bluebird');

var api = Api();
var Base = Model('Base');
var REDIS_PREFIX = Config('reward.REDIS_PREFIX');
var maxTimeDiff =  Config('reward.MAX_TIME_DIFF');
var minTimeDiff =  Config('reward.MIN_TIME_DIFF');
var redis = Redis();

var clonable = {};


var modelSchema = {
    transaction:{
        type:'string',
        searchable:{caseSensitive:true},
        enumerable:true,
        gettable:true,
        default:undefined
    },
    username :{
        type:'string',
        enumerable:true,
        gettable:true,
        default:""
    },
    advertiser:{
        type:'string',
        enumerable:true,
        gettable:true,
        default:""
    }
};


class Reward extends Base {

    constructor(data) {



        super(modelSchema,data,{});


    }


}


Reward.isRecent   = Promise.coroutine(isRecent);
Reward.prototype.model    = Promise.coroutine(model);
Reward.model    = Promise.coroutine(model);



    /////////////////////////////////////

function* model(){
    return  modelSchema
}


    function* isRecent(timestamp){

        if (timestamp === null) { return false; }

        // Is the transaction within a reasonable time range?
        let now = new Date().getTime();
        let timeDiff = now - timestamp;
        return (timeDiff < maxTimeDiff && timeDiff > minTimeDiff);

    }




///////////////////////////////////////////////////////////////////

module.exports.model = Reward;
