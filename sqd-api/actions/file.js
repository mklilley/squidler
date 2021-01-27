
'use strict';

exports.fileCreate = {
  name:                   'fileCreate',
  description:            'I upload a file (debug)',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  middleware:             ["blockGuest"],

  inputs: {
        file : {
      required:true,
            validator: function(param){
                if(param.type === "image/jpeg"){
                    if(param.size > 1024*1024){
                        return param.name + " is above the 1MB file size limit.";
                    }
                    else {
                        return true;
                    }
                }
                else {return param.name + " is not a valid image."; }
            }

    }
    },

  run: function(api, data, next) {

      let authUser = data.authUser;

    api.file.save(authUser,data.params.file.path)
        .then(fileURL => {
          data.response.success = true;
          data.response.file = fileURL;
          next();
        })
        .catch(error => {
          next(error);
        });
  }
};


//////////////////////////////////////////////////

exports.fileDelete = {
    name:                   'fileDelete',
    description:            'I delete a file (debug)',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             ["blockGuest","isAdmin"],

    inputs: {
        file : {
            required:true,
            validator: ['api.validator.string']
        }
    },

    run: function(api, data, next) {

        api.file.destroy(data.params.file)
            .then(() => {
                data.response.success = true;
                next();
            })
            .catch(error => {
                next(error);
            });
    }
};



//////////////////////////////////////////////////

exports.fileGet = {
    name:                   'fileGet',
    description:            'I get a file (debug)',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             [],

    inputs: {
        file : {
            required:true,
            validator: ['api.validator.string']
        }
    },

    run: function(api, data, next) {

        api.file.get(data.params.file)
            .then(file => {
                let fileBuff = new BufferStream(file.data);
                data.connection.rawConnection.responseHeaders.push(['Expires', file.expiresAt.toUTCString()]);
                api.servers.servers[data.connection.type].sendFile(data.connection, null, fileBuff,  file.contentType, file.data.byteLength);
                data.toRender = false;
                next();
            })
            .catch(error => {
                next(error);
            });
    }
};




//////////////////////////////////////////////////

exports.fileUpdate = {
    name:                   'fileUpdate',
    description:            'I update a file (debug)',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             ["blockGuest","isAdmin"],

    inputs: {
        file : {
            required:true,
            validator: ['api.validator.string']
        },
        expiry :{
            required:true
        }
    },

    run: function(api, data, next) {

        api.file.setExpiry(data.params.file,data.params.expiry)
            .then(fileURL => {
                data.response.success = true;
                data.response.file = fileURL
                next();
            })
            .catch(error => {
                next(error);
            });
    }
};
