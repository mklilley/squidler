'use strict';

var Promise = require('bluebird');


var api  = Api();
var Info = Model('Info');
var redis = Redis();




var InfoController = {
    create: Promise.coroutine(create),
    update: Promise.coroutine(update),
    get : Promise.coroutine(get),
    destroy: Promise.coroutine(destroy)
}

    /////////////////////////////////////

function* create(name,data){


        let infoExist = yield Info.exists({by:{name:name}});
        if(!infoExist){
            let info = new Info({name:name,data:data});
            yield info.save();
            return info;
        }
    else{
            return Promise.reject("Info " + name + " already exists");
        }


}

function* update(name,data){

    let infoExist = yield Info.exists({by:{name:name}});


    yield Info.set({by:{name:name}, target:"data", data:data});

    let info = yield Info.get({by:{name:name}});
    return info;



}

function* get(name){

    let info = yield Info.get({by:{name:name}});

  return info;



}


function* destroy(name){

    yield Info.destroy({by:{name:name}});
    return;
}







///////////////////////////////////////////////////////////////////


module.exports.controller = InfoController;
