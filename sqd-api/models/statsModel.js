'use strict';

var Promise = require('bluebird');

var api = Api();
var Base = Model('Base');
var REDIS_PREFIX = Config('stats.REDIS_PREFIX');
var redis = Redis();

var clonable = {};


var modelSchema = {
    name:{
        type:'string',
        searchable:{caseSensitive:false},
        enumerable:true,
        gettable:true,
        default:""
    },
    createdOn:{
        type:'oset',
        enumerable:true,
        gettable:true,
        default:undefined
    },
    total:{
        type:'string',
        enumerable:true,
        gettable:true,
        default:0
    }
};


class Stats extends Base {

    constructor(data) {



        super(modelSchema,data,{});


    }


}


Stats.prototype.model    = Promise.coroutine(model);
Stats.model    = Promise.coroutine(model);



    /////////////////////////////////////

function* model(){
    return  modelSchema
}




///////////////////////////////////////////////////////////////////

module.exports.model = Stats;
