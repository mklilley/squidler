
var redisHosts = process.env.REDIS_HOSTS;
var clusterConfig = [[]];

redisHosts = redisHosts.split(",");

for (let host of redisHosts){
  host = host.split(":");
  clusterConfig[0].push({
    host:host[0],
    port: host[1]
  });
}

var MyRedis  = require('ioredis');

MyRedis.Command.setArgumentTransformer('zadd', function (args) {
  if (args.length === 2) {
    if (typeof Map !== 'undefined' && args[1] instanceof Map) {
      // utils is a internal module of ioredis
      return [args[0]].concat(utils.convertMapToArray(args[1]));
    }
    if ( typeof args[1] === 'object' && args[1] !== null) {
      let A = [];
      for(let key of Object.keys(args[1])){
        A.push(args[1][key],key);
      }
      //return [args[0]].concat(utils.convertObjectToArray(args[1]));
      return [args[0]].concat(A);
    }
  }
  return args;
});

MyRedis.Command.setArgumentTransformer('zincrby', function (args) {
  if (args.length === 2) {
    if (typeof Map !== 'undefined' && args[1] instanceof Map) {
      // utils is a internal module of ioredis
      return [args[0]].concat(utils.convertMapToArray(args[1]));
    }
    if ( typeof args[1] === 'object' && args[1] !== null) {
      let A = [];
      for(let key of Object.keys(args[1])){
        A.push(args[1][key],key);
      }
      //return [args[0]].concat(utils.convertObjectToArray(args[1]));
      return [args[0]].concat(A);
    }
  }
  return args;
});

MyRedis.Command.setReplyTransformer('zrangebyscore', function (result) {
  if (Array.isArray(result)) {
    var obj = {};
    for (var i = 0; i < result.length; i += 2) {
      obj[result[i]] = parseInt(result[i + 1]);
    }
    return obj;
  }
  return result;
});

purgeRequireCache('ioredis');


exports['default'] = {
  redis: function(api){

    // konstructor: The redis client constructor method
    // args: The arguments to pass to the constructor
    // buildNew: is it `new konstructor()` or just `konstructor()`?

      return {
        '_toExpand': false,
        client: {
          konstructor: MyRedis.Cluster,
          args: clusterConfig,
          buildNew: true
        },
        subscriber: {
          konstructor: require('ioredis').Cluster,
          args: clusterConfig,
          buildNew: true
        },
        tasks: {
          konstructor: require('ioredis').Cluster,
          args: clusterConfig,
          buildNew: true
        }
      };


  }
};