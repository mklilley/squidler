(function () {
    'use strict';
    angular
        .module('sqd')
        .provider('history', historyProvider);

    historyProvider.$inject = [];

    function historyProvider() {

        var api;

        historyService.$inject = ['$q', 'resources', 'squidles', 'stores', 'exceptions'];

        var provider = {

            setApi: setApi,
            $get: historyService


        };

        return provider;


        ////////////////////////////////////////

        function setApi(url) {

            api = url;

        }





        /**
         * @ngdoc service
         * @name sqd.service:history
         * @param {object} $q Angular promise service
         * @param {object} resources Service to communicate with backend resources
         * @param {object} squidles Service to handle creating/reading/updating Squidles
         * @param {object} stores Service used to interface with the html5 local storage
          * @param {object} exceptions Service to catch a failed promise
         *
         * @returns {object} Service object exposing methods - read
         *
         * @description
         * This is a service that is returned as part of historyProvider. Used to retrieve a history of the Squidles that have either been created or viewed by the user
         */

        function historyService($q, resources, squidles, stores, exceptions) {

        var service = {

            read: read

        };

        return service;



        ////////////////////////////////////////

        /**
         * @ngdoc method
         * @name read
         * @methodOf  sqd.service:history
         * @param {object=} options If it contains the key "refresh" with value true then each entry of the history will be refreshed, otherwise only new squidles will be added
         * @returns {promise} Resolves to an array of squidle objects (see squidles.read for more details on the structure of those objects)
         *
         * @description Retrieves the Squidle history of a user
         * @example
         * <pre>history.read()</pre>
         *
         */

        function read(options) {


            var deferred = $q.defer(),
                options = options!==undefined ? options : {},
                silent = options.silent!==undefined ? options.silent : false,
                tempSquidles;

            if ((options).refresh){

                backupAndClearHistory().then(getUser).then(getHistoryList).then(getAllItems).catch(exceptions.create('Problem getting your Squidles history', {toBeRejected:{promise:deferred,message:'history.read error'},silent:silent}));



            }

            else{
                getUser().then(getHistoryList).then(getAllItems).catch(exceptions.create('Problem getting your Squidles history', {toBeRejected:{promise:deferred,message:'history.read error'},silent:silent}));

            }



            return deferred.promise;

            ////////////////////////////////////////

            function getUser(){
                return stores.read('auth', 'username');
            }

            function backupAndClearHistory(){
                return stores.read('squidles').then(function(squidles){
                  tempSquidles = squidles;
                  return stores.remove('squidles');
                });
            }

            function getHistoryList(username){

                return resources.read('history', api, username).catch(restoreOldSquidles);

            }

            function getAllItems(list){

                var proms = [];


                if(list){



                    for(var i=0;i<list.length;i++){

                        proms.push(squidles.read({short:list[i]},{silent:true}));

                    }



                   return $q.all(proms).then(postProcess,restoreOldSquidles);


                }

                else{
                deferred.resolve();
                return $q.when()
                }

                ////////////////////////////////////////

                function postProcess(squidles){

                    deferred.resolve(squidles);

                    return $q.when(squidles);

                }




            }

            function restoreOldSquidles(error){
                angular.forEach(tempSquidles,function(squidle,short){

                    stores.create('squidles',short,squidle);

                });
                return $q.reject(error);

            }



        }







    }



    }



})();
