'use strict';

var Promise = require('bluebird');

var api = Api();
var Base = Model('Base');
var REDIS_PREFIX = Config('squidle.REDIS_PREFIX');

var clonable = {}; // speed up!

class Test extends Base{
  constructor(){

      // TODO: move the model definition / schema outside of the class?, yes!

      let model = {
          name: "test",
          schema:{
              email:{
                  type:'string',
                  fillable:'true'
              },              
          }
      }
      
    super(model,clonable);

  }
}

Test.prototype.iTestStuff  = Promise.coroutine(iTestStuff);

    /////////////////////////////////////
    function* iTestStuff(){

    }
    /////////////////////////////////////

module.exports.model = Test;

