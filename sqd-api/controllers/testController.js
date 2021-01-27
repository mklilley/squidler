'use strict';

var Promise = require('bluebird');

var api  = Api();
var Test = Model('Test');
var redis = Redis();
var Squidle = Model('Squidle');
var User = Model('User');


var TestController = {
    run       : Promise.coroutine(run),
};

    /////////////////////////////////////
    function* run() {


        return;
    }





///////////////////////////////////////////////////////////////////

module.exports.controller = TestController;
