(function () {
    'use strict';
    angular
        .module('sqd')
        .provider('receipts', receiptsProvider);

    receiptsProvider.$inject = [];

    function receiptsProvider() {

        var api;

        receiptsService.$inject = ['$q', 'resources', 'stores', 'profiles', 'exceptions'];

        var provider = {

            setApi: setApi,
            $get: receiptsService


        };

        return provider;


        ////////////////////////////////////////

        function setApi(url) {

            api = url;

        }





        /**
         * @ngdoc service
         * @name sqd.service:receipts
         * @param {object} $q Angular promise service
         * @param {object} resources Service to communicate with backend resources
         * @param {object} stores Service used to interface with the html5 local storage
          * @param {object} profiles Retrives the public profile for a specific user
         *  @param {object} exceptions Service to catch a failed promise
         * @example
         *
         * @returns {object} Service object exposing methods - read
         *
         * @description
         * This is a service that is returned as part of statisticsProvider. Used to retrieve a statistics information on a particular Squidle
         */

        function receiptsService($q, resources, stores, profiles, exceptions) {

        var service = {

            read: read

        };

        return service;



        ////////////////////////////////////////


            ////////////////////////////////////////


            /**
             * @ngdoc method
             * @name read
             * @methodOf  sqd.service:credits
             * @param {object=} options If it contains the key "refresh" with value true then the credits will be updated from the server
             * @returns {promise} Resolves to an object with keys 'number' telling you the number of credits the current user has
             *
             * @description Retrieves the receipts from previous purchases for the current user
             * @example
             * <pre>receipts.read()</pre>
             *
             */

            function read(options) {

                var deferred = $q.defer(),
                    options = options !== undefined ? options : {},
                    refresh = options.refresh,
                    silent = options.silent !== undefined ? options.silent : false;

                if (refresh) {

                    return getReceipts().catch(exceptions.create('Problem getting your receipts',{silent: silent
                    }));


                }
                else {

                    return stores.read('receipts').catch(getReceipts).catch(exceptions.create('Problem getting your receipts', {silent: silent
                    }));
                }


                ////////////////////////////////////////

                function getReceipts() {

                    return stores.read('auth', 'username').then(function(username){
                        return resources.read('receipts', api, username).then(postProcess);
                    });

                    /////////////////////////////


                    function postProcess(receipts) {

                        var timeStamp;

                        for(var i=0;i<receipts.length;i++){
                            timeStamp = (new Date(receipts[i].date).getTime());
                           stores.create('receipts',timeStamp.toString(),receipts[i],{silent:true});

                        }


                        return $q.when(receipts);


                    }


                }





            }



    }



    }



})();
