var api;
var Promise = require('bluebird');
var crypto = require('crypto');
var stream  = require( "stream" );

exports['default'] = {
    helper: function(_api){
        api = _api; // Useful

        var Api = () => {
            return api;
        };

        var isEmpty = (obj) => {
            return (Object.keys(obj).length === 0 && obj.constructor === Object);
        };

        var endOfDaySec = () =>{
            let d = new Date();
            d.setHours(23,59,59,0);
            return d.getTime()/1000;
        }

        var objectFromArrays = (keys, values) => {
            if(keys.length===values.length) {
                var object = {};
                for (let j = 0; j <keys.length; j++) {
                    object[keys[j]] = values[j];
                }
                return object;
            }
            else{
                throw new SqdError({message:"objectFromArrays: Input arrays must be the same size",code:500});
            }
        }

        var Hash = (text) => {
            return crypto.createHash("sha256").update(text).digest("hex");
        }

        var Redis = () => {
            return api.redis.clients.client;
            //return api.config.redis.client;
        };

        var purgeRequireCache = (moduleName) => {

            // from http://stackoverflow.com/questions/9210542/node-js-require-cache-possible-to-invalidate/14801711#14801711

            // Traverse the cache looking for the files
            // loaded by the specified module name
            searchCache(moduleName, function (mod) {
                delete require.cache[mod.id];
            });

            // Remove cached paths to the module.
            // Thanks to @bentael for pointing this out.
            Object.keys(module.constructor._pathCache).forEach(function(cacheKey) {
                if (cacheKey.indexOf(moduleName)>0) {
                    delete module.constructor._pathCache[cacheKey];
                }
            });

            ///////////////////////////////////////
            /**
             * Traverses the cache to search for all the cached
             * files of the specified module name
             */
            function searchCache(moduleName, callback) {
                // Resolve the module identified by the specified name
                var mod = require.resolve(moduleName);

                // Check if the module has been resolved and found within
                // the cache
                if (mod && ((mod = require.cache[mod]) !== undefined)) {
                    // Recursively go over the results
                    (function traverse(mod) {
                        // Go over each of the module's children and
                        // traverse them
                        mod.children.forEach(function (child) {
                            traverse(child);
                        });

                        // Call the specified callback providing the
                        // found cached module
                        callback(mod);
                    }(mod));
                }
            };

        };



        /* Thanks: http://stackoverflow.com/questions/6393943/convert-javascript-string-in-dot-notation-into-an-object-reference  */
        var Config = (path) => {
            var config = api.config;
            return path.split('.').reduce((o,i)=>o[i], config);
        };

        var Controller = (name) => {
            return require(api.config.general.paths.controller[0] + '/' + name.toLowerCase() + 'Controller').controller;
        };

        var Middleware = (name) => {
            return require(api.config.general.paths.middleware[0] + '/' + name.toLowerCase() + 'Middleware').middleware;
        };

        var Model = (name) => {
            return require(api.config.general.paths.model[0] + '/' + name.toLowerCase() + 'Model').model;
        };


        class SqdError extends Error {
            constructor(input) {

                super();

                if(typeof input === "object"){
                    this.message = input.message || "";
                    this.code = input.code;
                }
                else{
                    this.message = input;
                }

            }

        }

        class BufferStream extends stream.Readable {
            constructor(source){
                if ( ! Buffer.isBuffer( source ) ) {

                    throw( new Error( "Source must be a buffer." ) );

                }
                super();
                this._source = source;
                this._offset = 0;
                this._length = source.length;

            }

            _read (size) {

                size = size ? size : 1024;

            // If we haven't reached the end of the source buffer, push the next chunk onto
            // the internal stream buffer.
            if ( this._offset < this._length ) {

                this.push( this._source.slice( this._offset, ( this._offset + size ) ) );

                this._offset += size;

            }

            // If we've consumed the entire source buffer, close the readable stream.
            if ( this._offset >= this._length ) {

                this.push(null);

            }

        };
        }




        global.Api = Api;
        global.Config = Config;
        global.isEmpty = isEmpty;
        global.objectFromArrays = objectFromArrays;
        global.Redis = Redis;
        global.purgeRequireCache = purgeRequireCache;
        global.Controller = Controller;
        global.Middleware = Middleware;
        global.Model = Model;
        global.SqdError = SqdError;
        global.BufferStream = BufferStream;
        global.Hash = Hash;
        global.endOfDaySec = endOfDaySec;



    }
};
