'use strict';

var Promise = require('bluebird');
var crypto = require('crypto');
var base62 = require('base-x')('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
var randomBytes = Promise.promisify(crypto.randomBytes);
var api = Api();
var MONGO_CONNECT = Config('file.MONGO_CONNECT');

var mongoose = require("mongoose");
mongoose.Promise = Promise;
mongoose.connect(MONGO_CONNECT,function(err,db){
    if(err){
        throw Error(err)
    }
});

var Schema = mongoose.Schema;

var fileSchema = new Schema({
    name:  {type:String,index:true},
    expiresAt : {type:Date,index:{expireAfterSeconds:0}},
    username: String,
    data: Buffer,
    contentType: String

});


fileSchema.statics.generateName = Promise.coroutine(generateName);
fileSchema.statics.exists = Promise.coroutine(exists);
fileSchema.statics.destroy = Promise.coroutine(destroy);
fileSchema.statics.get = Promise.coroutine(get);
fileSchema.statics.set = Promise.coroutine(set);


var File = mongoose.model('File', fileSchema);


///////////////////////////////////////////////

function* generateName(){

    let bytes  = parseInt(process.env.SQD_API_FILE_BYTES) || 32;
    let name;


    name = yield randomBytes(bytes)
        .then(buf => {
            let name = base62.encode(buf);
            return name;
        })
        .catch(error => {
            throw new SqdError({message:"File.generateName: " + error.message,code:500});
        });


    let fileExists = yield File.find({ name:  name}).limit(1).exec();


    if(fileExists.length!==0){
        return yield Promise.coroutine(generateName)();
    }
    else{
        return name;
    }


}



function* exists({by={}}){
    let key = Object.keys(by)[0];
    let value = by[key];

    let fileExists = yield File.find({ [key]:  value}).limit(1).exec();

    return fileExists.length!==0;

}

function* destroy({by={}, silent=false}){
    let key = Object.keys(by)[0];
    let value = by[key];

    let doc;
    try{
        doc = yield File.where().findOneAndRemove({[key]:  value}).exec();
    }
    catch(error){
        if(!silent) {
            throw new SqdError({message: "File.destroy: Problem deleting this file", code: 500});
        }
    }

    if(!doc && !silent){
        throw new SqdError({message:"File.destroy: File with " + key + " = " + value+" does not exist", code:404});
    }

    return;
}

function* get({by={}, silent=false}){
    let key = Object.keys(by)[0];
    let value = by[key];

    let file = yield File.findOne({[key]:  value}).exec();

    if(file){
        return file;
    }
    else if(!silent){
        throw new SqdError({message:"File.get: File with " + key + " = " + value+ " does not exist", code:404});
    }

}

function* set({by = {}, target="", data=undefined, silent=false}){
    let key = Object.keys(by)[0];
    let value = by[key];

    let res;
    try {
        res = yield File.where({[key]: value}).update({[target]: data});
    }
    catch(error){
        if(!silent) {
            throw new SqdError({message: "File.set: Problem updating file with " + key + " = " + value, code: 500});

        }
    }

    if(!res && !silent){
        throw new SqdError({message: "File.set: File with " + key + " = " + value + " does not exist", code: 404});
    }

    return;

}




///////////////////////////////////////////////////////////////////

module.exports.model = File;
