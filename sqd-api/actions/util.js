
'use strict';

exports.workerCleanOld = {
  name:                   'workerCleanOld',
  description:            'I clean old workers over a certain age (debug)',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  middleware:             ["blockGuest","isAdmin"],

  inputs: {
      age:{
          required:true
      }
  },

  run: function(api, data, next) {

      api.tasks.cleanOldWorkers(data.params.age, function(error, result){
          if(error){
              next(error);
          }
          else{
              data.response.success = true;
              data.response.cleaned = result;
              next();
          }
      });

  }
};

//////////////////////////////////////////////////


exports.hashEmail = {
    name:                   'hashEmail',
    description:            'I hash an email of a user (debug)',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             ["blockGuest","isAdmin"],

    inputs: {
        email:{
            required:true
        }
    },

    run: function(api, data, next) {

        var User = Model('User');

       User.set({by:{email:data.params.email}, target:"email", data: Hash(data.params.email)}).then(function(){
           data.response.success = true;
           next();
       }).catch(function(error){
           next(error);
       });


    }
};

//////////////////////////////////////////////////


exports.workerFailedGet = {
    name:                   'workerFailedGet',
    description:            'I get information on failed tasks',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             ["blockGuest","isAdmin"],

    inputs: {

    },

    run: function(api, data, next) {

        api.tasks.failed(0, -1, function(error, result){
            if(error){
                next(error);
            }
            else{
                data.response.success = true;
                data.response.failed = result;
                next();
            }
        });

    }
};



//////////////////////////////////////////////////


exports.workerFailedDeleteAll = {
    name:                   'workerFailedDeleteAll',
    description:            'I delete all failed tasks',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             ["blockGuest","isAdmin"],

    inputs: {

    },

    run: function(api, data, next) {

        api.tasks.failed(0, -1, function(error, result){
            if(error){
                next(error);
            }
            else{
                let numFailed = result.length;
                if(numFailed>0) {
                    let i = 0;
                    for (let failed of result) {
                        api.tasks.removeFailed(failed, (error, numRemoved)=> {
                            if (error) {
                                next(error);
                            }
                            else {
                                i += 1;
                                if (i === numFailed) {
                                    data.response.success = true;
                                    data.response.numRemoved = numFailed;
                                    next();
                                }
                            }

                        });
                    }
                }
                else{
                    data.response.success = true;
                    data.response.numRemoved = numFailed;
                    next();
                }



            }
        });

    }
};


exports.flush = {
    name:                   'flush',
    description:            'I flush the redis database',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             ["blockGuest","isAdmin"],

    inputs: {
        token:{
            required: false,
            validator:['api.validator.token'],
            formatter: ['api.formatter.removeWhiteSpace']
        }
    },


    run: function(api, data, next) {
        api.util.flush(data.params.token)
            .then(result => {
                data.response.success = true;
                data.response.message = result.message;
                if("token" in result){ data.response.token = result.token;}
                next();
            })
            .catch(error => {
                next(error);
            });
    }
};

//////////////////////////////////////////////////



exports.redisAction = {
    name:                   'redisAction',
    description:            'I call Base model methods to get or set data on redis',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             ["blockGuest","isAdmin"],

    inputs: {
        model:{
            required:true,
            validator: ['api.validator.string'],
            formatter: ['api.formatter.removeWhiteSpace', 'api.formatter.modelName']
        },
    method:{
        required:true
    },
    byKey:{
        required:true
    },
    byValue:{
        required:true
    },
        target:{
            required: false
        },
        only:{
            required: false
        },
        except:{
            required: false
        },
        data:{
            required: false
        },
        action:{
            required: false
        },
        one:{
            required: false
        },
        zero:{
            required: false
        },
        at:{
            required: false
        }
    },


    run: function(api, data, next) {
        api.util.baseAction(data.params)
            .then(result => {
                data.response.success = true;
                data.response.result = result;
                 next();
            })
            .catch(error => {
                next(error);
            });
    }
};

//////////////////////////////////////////////////




exports.taskStop = {
    name:                   'taskStop',
    description:            'I stop a recurrent task (debug)',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             ["blockGuest","isAdmin"],

    inputs: {
        task:{
            required:true,
            validator: ['api.validator.string']
        }
    },

    run: function(api, data, next) {

        api.tasks.stopRecurrentJob(data.params.task, function(error, removed){
            if(error){
                next(error);
            }
            else{
                api.tasks.delLock("lock:"+data.params.task+":default:[{}]", function(error, locks){
                    if(error){
                        next(error);
                    }
                    else{
                        data.response.success = true;
                        data.response.numberRemoved = removed;
                        data.response.numberLocksRemoved = locks;
                        next();
                    }
                });

            }
        });

    }
};


////////////////////////////////////////////





exports.taskStart = {
    name:                   'taskStart',
    description:            'I start a recurrent task (debug)',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             ["blockGuest","isAdmin"],

    inputs: {
        task:{
            required:true,
            validator: ['api.validator.string']
        }
    },

    run: function(api, data, next) {

        api.tasks.enqueueRecurrentJob(data.params.task, function(error, result){
            if(error){
                next(error);
            }
            else{
                data.response.success = true;
                next();
            }
        });

    }
};





//////////////////////////////////////////////////

exports.getSystemInfo = {
    name:                   'getSystemInfo',
    description:            'I get info from the servers about memory/disk usage etc',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             ["blockGuest","isAdmin"],

    inputs: {
       
    },


    run: function(api, data, next) {
        api.util.system(data.params.token)
            .then(system => {
                data.response.success = true;
                data.response.system = system;
                 next();
            })
            .catch(error => {
                next(error);
            });
    }
};

//////////////////////////////////////////////////
