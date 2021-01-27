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
         * @param {object=} options If it contains the key "refreshAll" with value true then each entry of the history will be refreshed, otherwise only new squidles will be added
         * @returns {promise} Resolves to an array of squidle objects (see squidles.read for more details on the structure of those objects)
         *
         * @description Retrieves the Squidle history of a user
         * @example
         * <pre>history.read()</pre>
         *
         */

        function read(options) {


            var deferred = $q.defer();

           stores.read('users', 'current').then(getHistoryList).then(getAllItems).catch(exceptions.create('Problem getting your Squidles history', deferred, 'history.read error'));


            return deferred.promise;

            ////////////////////////////////////////

            function getHistoryList(username){


                return resources.read('history', api, username);

            }

            function getAllItems(list){
                var proms = [],
                     shorts = list.shorts,
                     actions = list.actions,
                     tempSquidles;

                if ((options||{}).refreshAll){
                    stores.read('squidles').then(function(squidles){
                      tempSquidles = squidles;
                      stores.remove('squidles');
                    });

                }

                if(shorts){



                    for(var i=0;i<shorts.length;i++){

                        var squidle = {
                            short: shorts[i],
                            sent: actions[i]=="sent" ? true:false

                        };

                        proms.push(squidles.read(squidle));

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

                function restoreOldSquidles(){
                  angular.forEach(tempSquidles,function(squidle,short){

                    stores.create('squidles',short,squidle);

                  });
                  return $q.reject();

                }


            }



        }







    }



    }



})();
