'use strict';

var Promise = require('bluebird');


var api  = Api();
var Stats = Model('Stats');
var redis = Redis();


var launchDate = new Date(2016,10,10);
var oneDay = 24*60*60*1000;



var StatsController = {
    create: Promise.coroutine(create),
    stats : Promise.coroutine(stats),
    aggregate : Promise.coroutine(aggregate),
    destroy: Promise.coroutine(destroy)
}

    /////////////////////////////////////

function* create(){

    for(let model of ["user","squidle","receipt","reward"]){
        let statsExist = yield Stats.exists({by:{name:model}});
        if(!statsExist){
            let stats = new Stats({name:model});
            yield stats.save();
        }
    }

    return;

}

function* stats(model){

    let stats ={};
    let PRE, num;

    for(let model of ["user","receipt", "reward"]){
        stats[model] = {};
        PRE = Config(model+'.REDIS_PREFIX');

        stats[model] = yield Stats.get({by:{name:model}});
    }

    PRE = Config("squidle.REDIS_PREFIX");
    let numDaysSinceLaunch =   Math.round(Math.abs(Date.now() - launchDate.getTime())/(oneDay));
    num =  yield redis.get(PRE + ":last.id");
    stats["squidle"] = {};
    stats["squidle"] = yield Stats.get({by:{name:"squidle"}});



    return model ? stats[model] : stats;



}

function* aggregate(model){
    let values = [];

    yield StatsController.create();


    let masters = redis.nodes('master');
    for(let node of masters){
        let keys;
        if(model==="reward"){
            keys = yield node.keys(model + ":{*}:transaction");
        }
        else if(model==="squidle"){

            keys = yield node.keys("user:{*}:sent");

        }
        else{
            keys = yield node.keys(model + ":{*}:date");
            console.log(keys);
        }
        for(let key of keys){
            if(model!=="squidle") {
                values.push(yield node.get(key));
            }
            else{
                let tmp = yield redis.zrangebyscore(key, 0,"+inf", "WITHSCORES");
                for(let key of Object.keys(tmp)){
                    values.push(tmp[key]);
                }
            }
        }
    }

    for(let value of values){
        let d;
        if(model==="reward"){
            d = new Date(value.split(":").pop()*1);
        }
        else{
            d = new Date(value*1000);
        }
        d.setHours(23,59,59,0);
        let timeSec = d.getTime()/1000;
        yield Stats.set({by:{name:model}, target:"createdOn", data:{[timeSec]:1}, action:"incr"});
        yield Stats.set({by:{name:model}, target:"total", data:1, action:"incr"});
    }

    let agg = Stats.get({by:{name:model}});


return agg;

}

function* destroy(name){

    yield Stats.destroy({by:{name:name}});
    return;
}







///////////////////////////////////////////////////////////////////


module.exports.controller = StatsController;
