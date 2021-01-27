'use strict';

var Promise = require('bluebird');

var api = Api();
var Base = Model('Base');
var REDIS_PREFIX = Config('info.REDIS_PREFIX');
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
    data:{
        type:'hash',
        enumerable:true,
        gettable:true,
        default:{}
    }
};


class Info extends Base {

    constructor(data) {



        super(modelSchema,data,{});


    }


}


Info.prototype.model    = Promise.coroutine(model);
Info.model    = Promise.coroutine(model);



    /////////////////////////////////////

function* model(){
    return  modelSchema
}




///////////////////////////////////////////////////////////////////

module.exports.model = Info;
