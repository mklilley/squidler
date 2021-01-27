'use strict';

module.exports = {
    loadPriority:  1003,
    startPriority: 1003,
    stopPriority:  1003,
    initialize: function(api, next){
        api.test = Controller('Test');
        // TODO: Somehow instantiate a Test object for future cloning
        next();
    },
    start: function(api, next){
        next();
    },
    stop: function(api, next){
        next();
    }
};
