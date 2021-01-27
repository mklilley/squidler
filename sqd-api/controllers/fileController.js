'use strict';

var Promise = require('bluebird');
var fs = require('fs');

var api  = Api();
var File = Model('File');
var defaultExpiryHrs = Config('squidle.EXPIRY_HRS');
var BASE = Config('file.BASE');
var PATH = Config('file.PATH');

var FileController = {
    save      : Promise.coroutine(save),
    get      : Promise.coroutine(get),
    destroy   : Promise.coroutine(destroy)
}
    /////////////////////////////////////
    function* save(authUser,filePathTemp){

        var file = new File;
        try {
            file.data = fs.readFileSync(filePathTemp);
        }
        catch(error){
            throw new SqdError({message:"File.save: Problem saving your file the server",code:500})
        }

        file.contentType = 'image/jpeg';
        file.username = authUser.username;
        file.name = yield File.generateName();

        let date = new Date();
        date.setHours(date.getHours()+defaultExpiryHrs);
        file.expiresAt = date;

        try {
            yield file.save();
        }
        catch(error){
            throw new SqdError({message:"File.save: Problem saving your file the server",code:500})
        }

        return {url:BASE  + PATH  + file.name + ".jpeg"};

    }

function* get(filename){


    let name = filename.split(".")[0];
    let file = File.get({by:{name:name}});

    return file;

}


    function* destroy(filename){

        let name = filename.split(".")[0];
        yield File.destroy({by:{name:name}});

        return;

}



///////////////////////////////////////////////////////////////////


module.exports.controller = FileController;
