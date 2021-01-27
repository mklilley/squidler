(function () {
    'use strict';
    angular
        .module('sqd')
        .provider('stores', storesProvider);

    storesProvider.$inject = [];

    function storesProvider() {

        storesService.$inject = ['$q', '$localStorage','exceptions'];

        var provider = {

            $get: storesService


        };

        return provider;


        ////////////////////////////////////////





                        /**
         * @ngdoc service
         * @name sqd.service:stores
         * @param {object} $q Angular promise service
         * @param {object} $localStorage Third party service to access html5 local storage
         * @param {object} exceptions Service to catch a failed promise
         * @returns {object} Service object exposing methods - create, read, update
         *
         * @description
         * This is a service that is returned as part of storesProvider. Used to interface with the html5 local storage
         */

        function storesService($q, $localStorage, exceptions) {

        var service = {

            create: create,
            read: read,
            update: update,
            remove: remove

        };

        return service;



        ////////////////////////////////////////

 /**
         * @ngdoc method
         * @name create
         * @methodOf sqd.service:stores
         * @param {string} name Name of the type of entry you want to save e.g. 'squidles' (Note, this should be plural)
         * @param {string=} id Unique id of the entry to be saved. If not specified then an empty object will be created under "name" if it did not already exist, otherwise nothing is changed.
         * @param {object} data Data object to be saved
         *
         * @returns {promise} Resolves to a string of the form - name + " with id= " + id + " successfully saved to local storage" if the data is stored successfully, otherwise the promise is rejected

         *
         * @description Saves some data in the local storage, but only if it doesnt exist already.  It if does exist nothing is changed, update should be used instead.
         * @example
         * <pre>stores.create('squidles','VJ08tg6', {...squidle data...})</pre>
         *
         *
         */

        function create(name, id, data, options) {


            var deferred = $q.defer(),
                options = options!==undefined ? options : {},
                silent = options.silent!==undefined ? options.silent : false;

            try{

            $localStorage[name] = $localStorage[name] ? $localStorage[name] : {};

                if(id) {

                    var store = $localStorage[name][id];
                    if (store !== null && typeof store === 'object') {
                        angular.forEach(data, function (value, key) {
                            store[key] = store[key] !== undefined ? store[key] : value;
                        });

                    }
                    else if (store === undefined) {
                        $localStorage[name][id] = data;


                    }
                }


         // if(id) {$localStorage[name][id] = $localStorage[name][id] ? $localStorage[name][id] : data;}

            deferred.resolve(name + " with id= " + id + " successfully saved to local storage");}

            catch(error){
                        exceptions.create('Cannot store ' + name + ' with id ' + id, {toBeRejected:{promise:deferred, message:'stores.create error'},silent:silent})(error);
            }
            return deferred.promise;

            ////////////////////////////////////////




        }


             /**
         * @ngdoc method
         * @name read
         * @methodOf sqd.service:stores
         * @param {string} name Name of the type of entry you want to read e.g 'squidles' (Note, this should be plural)
         * @param {string=} id Unique id of the entry to be read. If not specified all entries under "name" will be returned
         *
         * @returns {promise} Resolves to an object specific to the type of data stored if the data is stored successfully, otherwise the promise is rejected
         *
         * @description Reads some data in the local storage
         * @example
         * <pre>stores.read('squidles','VJ08tg6')</pre>
         *
         *
         */


        function read(name, id, options) {

            var deferred = $q.defer(),
                store,
                storeCopy,
                options = options!==undefined ? options : {},
                silent = options.silent!==undefined ? options.silent : false;
                try {
                    store = id ? $localStorage[name][id] : $localStorage[name];
                if (store) {
                    storeCopy = angular.copy(store);
                    deferred.resolve(storeCopy);
                }
                else{
                    throw 'NA'
                }

                }
            catch(error){
                            deferred.reject('Cannot read ' + name + ' with id ' + id + '. Data not in storage');
            }


            return deferred.promise;

            ////////////////////////////////////////




        }

             /**
         * @ngdoc method
         * @name update
         * @methodOf sqd.service:stores
         * @param {string} name Name of the type of entry you want to update e.g. 'squidles' (Note, this should be plural)
         * @param {string} id Unique id of the entry to be updated
         * @param {object} data Object with updated data, note not all original data keys need to be present, only ones that you want to change
         *
         * @returns {promise} Resolves to a string of the form - name + " with id= " + id + " successfully updated" if the data is updated successfully, otherwise the promise is rejected

         *
         * @description Updated some data in the local storage
         * @example
         * <pre>stores.update('squidles','VJ08tg6', {...squidle data...})</pre>
         *
         *
         */


        function update(name, id, data, options) {

           var deferred = $q.defer(),
                 options = options!==undefined ? options : {},
                     silent = options.silent!==undefined ? options.silent : false;

            try {
                var store = $localStorage[name][id];
                if (store !==null && typeof store ==='object') {
               angular.forEach(data, function(value, key){
                    store[key] = value;
               });
               deferred.resolve(store);
           }
           else if (store !==null && store!==undefined) {
                    $localStorage[name][id] = data;
                    deferred.resolve(store);

           }
                else{
                    throw 'NA'
                }

            }
            catch(error){exceptions.create('Cannot update ' + name + ' with id ' + id + '. Data not in storage', {toBeRejected:{promise:deferred, message:'stores.update error'},silent:silent})(error)}




           return deferred.promise;

           ////////////////////////////////////////



       }


                         /**
         * @ngdoc method
         * @name remove
         * @methodOf sqd.service:stores
         * @param {string} name Name of the type of entry you want to remove e.g. 'tempSquidle'
         * @param {string=} id Unique id of the entry to be removed (if not present then all ids will be removed and the store will be reset to {})
         * @param {array=} fields Array of strings that are the keys to be delted. NOTE if not present then the entire data entry will be delted from the local storage
         *
         * @returns {promise} Resolves to a string of the form - 'Entries from ' name  " with id= " id  " successfully deleted from the local storage" if the data is was deleted successfully, otherwise the promise is rejected

         *
         * @description Removes some data in the local storage
         * @example
         * <pre>stores.remove('tempSquidle','prize',['image'])</pre>
         *
         *
         */


        function remove(name, id, fields, options) {


           var deferred = $q.defer(),
               options = options!==undefined ? options : {},
               silent = options.silent!==undefined ? options.silent : false;

            if(name){

            try {
                var store = $localStorage[name];

                if(store && id){
                    store = $localStorage[name][id];
                if (store) {
                    if(fields){
               angular.forEach(fields, function(value, key){
                    delete store[value];
               });

           }
                    else{
                    delete $localStorage[name][id];
                    }
                deferred.resolve('Entries from '+ name + " with id= " + id + " successfully deleted from the local storage");
                }
                    else{
                         throw 'NA'

                    }

            }
                else{
                   $localStorage[name] = {};
                   deferred.resolve();
                }

            }
            catch(error){exceptions.create('Cannot delete entries from ' + name + ' with id ' + id + '. Data not in storage', {toBeRejected:{promise:deferred, message:'stores.destroy error'},silent:silent})(error)}

            }

            else{
                $localStorage.$reset();
                deferred.resolve();

            }






           return deferred.promise;

           ////////////////////////////////////////



       }





    }



    }



})();
