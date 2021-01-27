'use strict';

var Promise = require('bluebird');
var extend = require('util')._extend;

var redis = Redis();

class Base {
    constructor(model,data,clonable){

        data = data === undefined ? {} : data;


        Object.defineProperty(this, "id", {
            value:data.id,
            writable: true,
            enumerable: false,
            configurable: true
        });


        for (let key in model){
            Object.defineProperty(this,  key, {
                writable: true,
                enumerable:  model[key].enumerable,
                configurable: true
            });

            if(typeof data[key]  === 'undefined'){
                this[key] = typeof model[key].default === "function" ? model[key].default() : model[key].default;
            }
            else{
                this[key] = data[key];
            }


        }

        return;

        if(isEmpty(clonable)){

            this.id        =  0;
            this.__model__ = {};

            Object.assign(this.__model__,model);
            //this.__model__.id               = 0;

            for (var key in this.__model__.schema) {
                if(this.__model__.schema.hasOwnProperty(key)){
                    let property = this.__model__.schema[key];
                    let value;
                    if(property.hasOwnProperty('type')){
                        switch(property.type) {
                            case 'string':
                                value = '';
                                break;
                            case 'hash':
                                value = {};
                                break;
                            //TODO: other type of redis values
                            default:
                        }
                    } else {
                        // We are in trouble
                    }

                    Object.defineProperty(this, key, {
                        value: value,
                        writable: true,
                        enumerable: true,
                        configurable: true
                    });
                    //Object.assign(this,key);
                    //console.log(this.__model__.schema[key]);
                }
            }

            // Save clonable data, inspired by Node ._extends
            extend(clonable,this);

            // exports._extend = function(origin, add) {
            //     // Don't do anything if add isn't an object
            //     if (!add || !isObject(add)) return origin;
            //
            //     var keys = Object.keys(add);
            //     var i = keys.length;
            //     while (i--) {
            //         origin[keys[i]] = add[keys[i]];
            //     }
            //     return origin;
            // };


        } else {
            // Clone
            Object.assign(this,clonable);
        }

    }

}

Base.prototype.save  = Promise.coroutine(save);
//Base.getIdBy  = Promise.coroutine(getIdBy);
Base.get  = Promise.coroutine(get);
//Base.getNextId = Promise.coroutine(getNextId);
//Base.getTempId = Promise.coroutine(getTempId);
Base.destroy = Promise.coroutine(destroy);
Base.set = Promise.coroutine(set);
Base.setBit = Promise.coroutine(setBit);
Base.getBit = Promise.coroutine(getBit);
Base.setExpiry = Promise.coroutine(setExpiry);
Base.exists = Promise.coroutine(exists);

    /////////////////////////////////////
    function* save({exp = undefined, temp = false}={}) {


        let name = this.constructor.name;
        let PRE = Config(this.constructor.name.toLowerCase()+'.REDIS_PREFIX');
        let model = yield this.model();


        if(this.id === undefined) {
            this.id = temp ? (yield redis.decr(PRE + ":" + "tmp.id")) : (yield redis.incr(PRE + ":" + "last.id"));
        }

        let multi = [];
        for (let key of Object.keys(this)) {
            if (this[key]!== undefined && this[key] !== null) {
                let command;
                switch (model[key].type) {
                    case "string":
                        command = ["set",  PRE + ":{" + this.id + "}:" + key, this[key]];
                        multi.push(command);
                        break;
                    case "bitmap":
                        if(Array.isArray(this[key])){
                            for(let question of this[key]){
                                let offset = model[key].offset[question];
                                if(offset!==undefined) {
                                    command = ["setbit",  PRE + ":{" + this.id + "}:" + key, [offset, 1]];
                                    multi.push(command);
                                }
                            }
                            if(this[key].length===0){
                                command = ["setbit",  PRE + ":{" + this.id + "}:" + key, [1, 0]];
                                multi.push(command);
                            }
                        }
                        else{
                            command = ["set",  PRE + ":{" + this.id + "}:" + key, this[key]];
                            multi.push(command);
                        }
                        break;
                    case "hash":
                        command = ["hmset",  PRE + ":{" + this.id + "}:" + key, this[key]];
                        multi.push(command);
                        break;
                    case "oset":
                        command = ["zadd",  PRE + ":{" + this.id + "}:" + key, this[key]];
                        multi.push(command);
                        break;
                    case "list":
                        command = ["rpush",  PRE + ":{" + this.id + "}:" + key, this[key]];
                        multi.push(command);
                        break;
                    default:
                        break
                }


                if (exp) {
                    multi.push(['expireat',  PRE + ":{" + this.id + "}:" + key, exp]);
                }

                if (model[key].searchable && this[key]!== undefined && this[key] !== null) {
                    let multiSearchable = [];
                    let searchKey = model[key].searchable.caseSensitive ? this[key] : this[key].toLowerCase();
                    multiSearchable.push(['set', PRE + ":getBy:" + key + ":{" + searchKey + "}", this.id]);
                    if (exp) {
                        multiSearchable.push(['expireat', PRE + ":getBy:" + key + ":{" + searchKey + "}", exp]);
                    }
                    yield redis.multi(multiSearchable).exec();
                }
            }
        }


        yield redis.multi(multi).exec();


        return this;


    }


    // function* getIdBy({key = "", value ="", REDIS_PREFIX = ""}){
    //
    //     let id = yield redis.get(REDIS_PREFIX + ":" + key + ":" + value);
    //
    //     if(id){
    //         return id;
    //     }
    //     else{
    //         throw new Error(this.name + ".getIdBy: " + this.name + " with " + key + " = "+ value + " does not exist");
    //     }
    //
    //
    // }

    function* get({by = {}, only=[], except=[], silent=false}){

        let key = Object.keys(by)[0];
        let value = by[key];
        let model = yield this.model();
        let filter = [];

         if(only.length!==0){
            filter = only;
        }
        else {

            filter = Object.keys(model);

            if(except.length!==0){
                for(let field of except){
                    filter.splice(filter.indexOf(field), 1);
                }
            }
        }


        let name = this.name;
        let PRE = Config(this.name.toLowerCase()+'.REDIS_PREFIX');
        let id;

        if(key==="id"){
            id = value;
        }
        else{
            value = model[key].searchable.caseSensitive ? value : value.toLowerCase();
            id = yield redis.get(PRE + ":getBy:" + key + ":{" + value + "}");
        }



        if(id){

            let multi = [];
            let keyList = [];
            for (let item of filter) {

                    let key, options;
                    if (Array.isArray(item)) {
                        key = item[0];
                        options = item.slice(1);
                    }
                    else {
                        key = item;
                        options = undefined;
                    }
                if(model[key].gettable) {

                    keyList.push(key);
                    let query=[];
                    switch (model[key].type) {
                        case "string":
                            query = ["get",  PRE + ":{" + id + "}:" + key];
                            break;
                        case "hash":
                            query = options ? ["hmget",  PRE + ":{" + id + "}:" + key, options] : ["hgetall",  PRE + ":{" + id + "}:" + key];
                            break;
                        case "oset":
                            query = options ? ["zrangebyscore",  PRE + ":{" + id + "}:" + key, options, "WITHSCORES"] : ["zrangebyscore",  PRE + ":{" + id + "}:" + key, [0, "+inf"], "WITHSCORES"];
                            break;
                        // case "bitmap":
                        //     let intType = "u"+Object.keys(model[key].offset).length;
                        //    query = ["bitfield",  PRE + ":{" + id + "}:" + key, ["get",intType,0]];
                        //     break;
                        case "list":
                            query = options ? ["lrange",  PRE + ":{" + id + "}:" + key, options] : ["lrange",  PRE + ":{" + id + "}:" + key, [0, 140]];
                            break;
                        default:
                            break
                    }

                    multi.push(query);

                }


            }

            let result =  yield redis.multi(multi).exec();
            let data={};
            for(let key of Object.keys(model)){
                data[key] = null;
            }
            for(let j=0; j<keyList.length; j++){
                switch(model[keyList[j]].type) {
                    case "hash":
                        // HGETALL returns a nice object with keys and values, HMGET only returns values of the fields, so we have to make our own object from array of keys and the array of values returned from redis
                        data[keyList[j]] = result[j][1] instanceof Array ? objectFromArrays(filter[j].slice(1), result[j][1]) : result[j][1];
                        break;
                    case "oset":
                        data[keyList[j]] = isEmpty(result[j][1]) ? null : result[j][1];
                        break;
                    // case "bitmap":
                    //     // since default of bitmap is always an array of questions when we save, we need to make sure this is what is returned when we do a get.
                    //     let list = [];
                    //     let numOffset = Object.keys(model[keyList[j]].offset).length;
                    //     for(let item of Object.keys(model[keyList[j]].offset)){
                    //         let offset = model[keyList[j]].offset[item];
                    //         //parseInt(result[j][1][0].toString(2)[offset])
                    //        if(parseInt(result[j][1][0]) & ( 1 <<  (numOffset-1) - offset)){
                    //             list.push(item);
                    //         }
                    //     }
                    //     data[keyList[j]] = list;
                    //     break;
                    case "list":
                        data[keyList[j]] = (result[j][1]).length ===0 ? null : result[j][1];
                        break;
                    default:
                        data[keyList[j]] = result[j][1];
                        break;
                }
            }
            data.id = id;

            let classInstance = new this(data);

            return classInstance;

        }
        else{
            if(!silent){
                throw new SqdError({message:name + ".get: " + name + " with " + key + " = "+ value + " does not exist",code:404});
            }
            else{
                return;
            }

        }

    }



    function* set({by = {}, target="", data=undefined, action=undefined, exp=undefined, silent=false}){

        let key = Object.keys(by)[0];
        let value = by[key];
        let model = yield this.model();
        let id;

        let name = this.name;
        let PRE = Config(this.name.toLowerCase()+'.REDIS_PREFIX');

        if(key==="id"){
            id = value;
        }
        else{
            value = model[key].searchable.caseSensitive ? value : value.toLowerCase();
            id = yield redis.get(PRE + ":getBy:" + key + ":{" + value + "}");
        }

        if(id) {

            let multi = [];

            if (data !== undefined && data !== null) {
                let command;
                switch (model[target].type) {
                    case "string":
                        command = ["incr"].indexOf(action) !== -1 ? "incrby" : "set";
                        break;
                    case "bitmap":
                        command = "set";
                        break;
                    case "hash":
                        command = "hmset";
                        break;
                    case "oset":
                        command = ["incr"].indexOf(action) !== -1 ? "zincrby" : "zadd";
                        break;
                    default:
                        break
                }

                multi.push([command,  PRE + ":{" + id + "}:" + target, data]);
                if (exp) {
                    multi.push(['expireat',  PRE + ":{" + id + "}:" + target, exp]);
                }
                if(model[target].searchable){
                    let searchKey;
                    let oldData = yield redis.get(PRE + ":{" + id + "}:" + target);
                    if(oldData!== undefined && oldData !== null) {
                        searchKey = model[target].searchable.caseSensitive ? oldData : oldData.toLowerCase();
                        yield redis.del(PRE + ":getBy:" + target + ":{" + searchKey + "}");
                        //multi.push(["del", PRE + ":getBy:" + target + ":{" + searchKey + "}"]);
                    }

                    let multiSearchable = [];
                    searchKey = model[target].searchable.caseSensitive ? data : data.toLowerCase();
                    multiSearchable.push(['set', PRE + ":getBy:" + target + ":{" + searchKey + "}", id]);
                    if (exp) {
                        multiSearchable.push(['expireat',  PRE + ":getBy:" + target + ":{" + searchKey + "}", exp]);
                    }
                    yield redis.multi(multiSearchable).exec();
                }
                let result = yield redis.multi(multi).exec();
                return result[0][1];

            }
            else {
                if(!silent){
                    throw new SqdError({message:name + ".set: No data provided for a set to " + name + ":" + id + ":" + target,code:500});
                }
                else{
                    return;
                }

            }
        }
        else{
            if(!silent){
                throw new SqdError({message:name + ".set: " + name + " with " + key + " = "+ value + " does not exist",code:404});
            }
            else{
                return;
            }

        }


    }


    function* setBit({by = {}, target="", one=[], zero=[], silent=false}){
        let key = Object.keys(by)[0];
        let value = by[key];
        let model = yield this.model();
        let id;

        let name = this.name;
        let PRE = Config(this.name.toLowerCase()+'.REDIS_PREFIX');

        if(model[target].type==="bitmap") {

            if (key === "id") {
                id = value;
            }
            else {
                value = model[key].searchable.caseSensitive ? value : value.toLowerCase();
                id = yield redis.get(PRE + ":getBy:" + key + ":{" + value + "}");
            }

            if(id){
                let multi = [];
                let command;
                   for(let item of one){
                        let offset = model[target].offset[item];
                        if(offset!==undefined) {
                            command = ["setbit",  PRE + ":{" + id + "}:" + target, [offset, 1]];
                            multi.push(command);
                        }
                    }
                for(let item of zero){
                    let offset = model[target].offset[item];
                    if(offset!==undefined) {
                        command = ["setbit",  PRE + ":{" + id + "}:" + target, [offset, 0]];
                        multi.push(command);
                    }
                }

                yield redis.multi(multi).exec();
                return;

            }
            else{
                if(!silent){
                    throw new SqdError({message:name + ".setBit: " + name + " with " + key + " = "+ value + " does not exist",code:404});
                }
                else{
                    return;
                }

            }



        }
        else{
            if(!silent){
                throw new SqdError({message:name + ".getBit: " + target + " is not a bitmap",code:500});
            }
            else{
                return;
            }

        }


    }




function* getBit({by = {}, target="", only=[], silent=false}){
    let key = Object.keys(by)[0];
    let value = by[key];
    let model = yield this.model();
    let id;

    let name = this.name;
    let PRE = Config(this.name.toLowerCase()+'.REDIS_PREFIX');

    if(model[target].type==="bitmap") {

        if (key === "id") {
            id = value;
        }
        else {
            value = model[key].searchable.caseSensitive ? value : value.toLowerCase();
            id = yield redis.get(PRE + ":getBy:" + key + ":{" + value + "}");
        }

        if(id){
            let multi = [];
            let command;
            for(let item of only){
                let offset = model[target].offset[item];
                if(offset!==undefined) {
                    command = ["getbit",  PRE + ":{" + id + "}:" + target, offset];
                    multi.push(command);
                }
            }

            let result = yield redis.multi(multi).exec();
            let bits=[];
            for(let item of result){
                bits.push(parseInt(item[1]));
            }
            return bits.length!==1 ? bits : bits[0];

        }
        else{
            if(!silent){
                throw new SqdError({message:name + ".setBit: " + name + " with " + key + " = "+ value + " does not exist",code:404});
            }
            else{
                return;
            }

        }



    }
    else{
        if(!silent){
            throw new SqdError({message:name + ".getBit: " + target + " is not a bitmap",code:500});
        }
        else{
            return;
        }

    }


}



    function* setExpiry({by = {}, only=[], except=[], at="", silent=false}){
        let key = Object.keys(by)[0];
        let value = by[key];
        let model = yield this.model();
        let filter = [];


        if(only.length!==0){
            filter = only;
        }
        else {

            filter = Object.keys(model);

            if(except.length!==0){
                for(let field of except){
                    filter.splice(filter.indexOf(field), 1);
                }
            }
        }


        let name = this.name;
        let PRE = Config(this.name.toLowerCase()+'.REDIS_PREFIX');
        let id;

        if(key==="id"){
            id = value;
        }
        else{
            value = model[key].searchable.caseSensitive ? value : value.toLowerCase();
            id = yield redis.get(PRE + ":getBy:" + key + ":{" + value + "}");
        }



        if(id) {

            let data = yield this.get({by: {[key]: value}});


            let multi = [];
            let keyList = [];
            if (at === "inf"){
                for (let item of filter) {

                    multi.push(['persist', PRE + ":{" + id + "}:" + item]);

                    if (model[item].searchable && data[item]!== undefined && data[item] !== null) {
                        let searchKey = model[item].searchable.caseSensitive ?  data[item] : data[item].toLowerCase();
                        yield redis.persist(PRE + ":getBy:" + item + ":{" + searchKey + "}");

                    }
                }


        }
            else{

                for (let item of filter) {

                    multi.push(['expireat', PRE + ":{" + id + "}:" + item, at]);

                    if (model[item].searchable && data[item]!== undefined && data[item] !== null) {
                        let searchKey = model[item].searchable.caseSensitive ?  data[item] : data[item].toLowerCase();
                        yield redis.expireat(PRE + ":getBy:" + item + ":{" + searchKey + "}",at);
                    }
                }

            }
            return yield redis.multi(multi).exec();
        }

        else{
            if(!silent){
                throw new SqdError({message:name + ".setExpiry: " + name + " with " + key + " = "+ value + " does not exist",code:404});
            }
            else{
                return;
            }

        }


    }



    function* exists({by={}}){
        let key = Object.keys(by)[0];
        let value = by[key];
        let model = yield this.model();

        value = model[key].searchable.caseSensitive ? value : value.toLowerCase();

        let name = this.name;
        let PRE = Config(this.name.toLowerCase()+'.REDIS_PREFIX');
        let id =  yield redis.get(PRE + ":getBy:" + key + ":{" + value + "}");

        return id!==null;

    }







    function* destroy({by = {}, only=[], except=[], silent=false}){

        let key = Object.keys(by)[0];
        let value = by[key];
        let model = yield this.model();
        let filter = [];


        if(only.length!==0){
            filter = only;
        }
        else {

            filter = Object.keys(model);

            if(except.length!==0){
                for(let field of except){
                    filter.splice(filter.indexOf(field), 1);
                }
            }
        }


        let name = this.name;
        let PRE = Config(this.name.toLowerCase()+'.REDIS_PREFIX');
        let id;

        if(key==="id"){
            id = value;
        }
        else{
            value = model[key].searchable.caseSensitive ? value : value.toLowerCase();
            id = yield redis.get(PRE + ":getBy:" + key + ":{" + value + "}");
        }



        if(id){

            let data = yield this.get({by:{[key]:value}});

            let multi = [];
            let keyList = [];
            for (let item of filter) {

                let key,options;
                if(Array.isArray(item)){
                    key = item[0];
                    options = item.slice(1);
                }
                else{
                    key = item;
                    options = undefined;
                }
                keyList.push(key);
                let query;
                switch (model[key].type) {
                    case "string":
                        query = ["del",  PRE + ":{" + id + "}:" + key];
                        break;
                    case "hash":
                        query = options ? ["hdel",   PRE + ":{" + id + "}:" + key, options] : ["del",   PRE + ":{" + id + "}:" + key];
                        break;
                    case "oset":
                        query = options ? ["zrem",   PRE + ":{" + id + "}:" + key, options] : ["del",   PRE + ":{" + id + "}:" + key];
                        break;
                    case "bitmap":
                       query = ["del",  PRE + ":{" + id + "}:" + key];
                        break;
                    case "list":
                        query = ["del",  PRE + ":{" + id + "}:" + key];
                        break;
                    default:
                        break
                }

                multi.push(query);

                if (model[key].searchable && data[key]!== undefined && data[key] !== null) {
                    let searchKey = model[key].searchable.caseSensitive ?  data[key] : data[key].toLowerCase();
                    yield redis.del(PRE + ":getBy:" + key + ":{" + searchKey + "}");
                }


            }

            yield redis.multi(multi).exec();

            return;

        }
        else{
            if(!silent){
                throw new SqdError({message:name + ".destroy: " + name + " with " + key + " = "+ value + " does not exist",code:404});
            }
            else{
                return;
            }


        }


    }





///////////////////////////////////////////////////////////////////


module.exports.model = Base;
