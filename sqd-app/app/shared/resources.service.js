(function () {
    'use strict';
    angular
        .module('sqd')
        .provider('resources', resourcesProvider);

    resourcesProvider.$inject = [];

    function resourcesProvider() {

        var waitTime;
        
         resourcesService.$inject = ['$q', '$http',  '$timeout','exceptions', '$cordovaNetwork', '$ionicPlatform'];

        var provider = {

            setWaitTime: setWaitTime,
            $get: resourcesService


        };

        return provider;


        ////////////////////////////////////////

        function setWaitTime(time_ms) {

            waitTime = time_ms;

        }

        
                /**
         * @ngdoc service
         * @name sqd.service:resources
         * @param {object} $q Angular promise service
         * @param {object} $http Angular http service
         * @param {object} $timeout Angular timeout service
         * @param {object} exceptions Service to catch a failed promise
         * @param {object} $cordovaNetwork ngCordova Service to tell if the network is avaiable or not
         * @param {object} $ionicPlatform Ionic platform service
         * @returns {object} Service object exposing methods - create, read, update
         *
         * @description
         * This is a service that is returned as part of resourcesProvider. Used to communicte with all squidler backend resources
         */

        function resourcesService($q, $http, $timeout, exceptions, $cordovaNetwork, $ionicPlatform) {
            

      

        var service = {

            create: create,
            read: read,
            update: update

        };

        return service;



        ////////////////////////////////////////


                    /**
         * @ngdoc method
         * @name create 
         * @methodOf sqd.service:resources
         * @param {string} name Primary key used for encoding the  JSON data sent to backend and for reading the response data, e.g. 'squidles'
         * @param {string} api URL of the backend api for the  resource described by 'name', e.g. '/api/v1/squidles'
         * @param {object} data Data object specific to the backend resource, see http://#/api/backend_resource_list
         * @param {object=} options {formData:bool} 
         * @returns {promise} Resolves to an object specific to the backend resource if the resource was created successfully.  Otherwise the promise is rejected with an object of the form {message:string, code:int}

         * 
         * @description Creates a resource on the backend, using a POST method. This takes a minimum time set in the config of resourcesProvider using the method setWaitTime
         * @example
         * <pre>resources.create('squidle','http://squidler.com/api/v1/squidles', {...squidle data...})</pre>
         *
         * 
         */

        function create(name, api, data, options, silent) {

            var deferred = $q.defer(),
                startTime = new Date().getTime(),
                namedData = {},
                config = {},
                silent = silent ? silent : false;

                if(options||{}.formData){
                     config = {transformRequest: angular.identity,headers: {'Content-Type': undefined}};

                    namedData = new FormData();
                    namedData.append(name, data);
                }

                else{
                    namedData[name] = data;

                }
            
         try {
             $ionicPlatform.ready(function () {
                 


                 if ($cordovaNetwork.isOffline()) {

                     exceptions.create('No internet connection', deferred, 'No internet connection',silent)('No internet connection');
                 } else {
                     $http.post(api, namedData, config).then(processResponse).catch(exceptions.create('Cannot create ' + name + ' on the server', deferred, 'resources.create fail',silent));
                 }


             });
         } catch(err) {
             
             
             $http.post(api, namedData, config).then(processResponse).catch(exceptions.create('Cannot create ' + name + ' on the server', deferred, 'resources.create fail',silent));
         }








/*             $timeout(function () {
                        deferred.resolve(namedData);
                    }, waitTime);*/


            return deferred.promise;

            ////////////////////////////////////////

            function processResponse(response) {

                var responseTime = new Date().getTime() - startTime;

                if (responseTime <= waitTime) {
                    $timeout(function () {
                        if(response.data.success){
                        deferred.resolve(response.data[name]);}
                        else{
                            deferred.reject(response.data.errors)
                        }
                    }, waitTime - responseTime);
                } else {
                                           if(response.data.success){
                        deferred.resolve(response.data[name]);}
                        else{
                            deferred.reject(response.data.errors)
                        }
                }

            }





        }


                    /**
         * @ngdoc method
         * @name read 
         * @methodOf sqd.service:resources
         * @param {string} name Primary key used for reading the response data from the backend, e.g. 'squidles'
         * @param {string} api URL of the backend api for the  resource described by 'name', e.g. '/api/v1/squidles'
         * @param {string} id Used to uniquely identify the requested resource, e.g. '8KLv694'
         * @param {object=} params Extra information specific to the backend resource, e.g. {guess:blue} for trying to get the Squidle prize, see http://#/api/backend_resource_list
         * @returns {promise} Resolves to an object specific to the backend resource if the resource was read successfully.  Otherwise the promise is rejected with an object of the form {message:string, code:int}

         * 
         * @description Reads a resource on the backend, using a GET method. This takes a minimum time set in the config of resourcesProvider using the method setWaitTime
         * @example
         * <pre>resources.read('history', 'http://squidler.com/api/v1/history', 'joblogs')</pre>
         *
         * 
         */
            
        function read(name, api, id, params, silent) {

            var deferred = $q.defer(),
                startTime = new Date().getTime(),
                p = {
                    params: params
                },
                silent = silent ? silent : false;
            
        
     try {
         $ionicPlatform.ready(function () {

             if ($cordovaNetwork.isOffline()) {

                 exceptions.create('No internet connection', deferred, 'No internet connection',silent)('No internet connection');
             } else {
                 $http.get(api + "/" + id, p).then(processResponse).catch(exceptions.create('Cannot find ' + name + ' on the server', deferred, 'resources.read fail',silent));
             }


         });
     } catch(err) {
         
         $http.get(api + "/" + id, p).then(processResponse).catch(exceptions.create('Cannot find ' + name + ' on the server', deferred, 'resources.read fail',silent));
     }

            

            return deferred.promise;

            ////////////////////////////////////////

            function processResponse(response) {

                var responseTime = new Date().getTime() - startTime;

                if (responseTime <= waitTime) {
                    $timeout(function () {
                        if(response.data.success){
                        deferred.resolve(response.data[name]);}
                        else{
                            deferred.reject(response.data.errors)
                        }
                    }, waitTime - responseTime);
                } else {
                                           if(response.data.success){
                        deferred.resolve(response.data[name]);}
                        else{
                            deferred.reject(response.data.errors)
                        }
                }

            }



        }

/**
         * @ngdoc method
         * @name update 
         * @methodOf sqd.service:resources
         * @param {string} name Primary key used for reading the response data from the backend, e.g. 'squidles'
         * @param {string} api URL of the backend api for the  resource described by 'name', e.g. '/api/v1/squidles'
         * @param {string} id Used to uniquely identify the requested resource, e.g. '8KLv694'
         * @param {object} data Data object specific to the backend resource, see http://#/api/backend_resource_list
         * @returns {promise} Resolves to an object specific to the backend resource if the resource was updated successfully.  Otherwise the promise is rejected with an object of the form {message:string, code:int}

         * 
         * @description Updates a resource on the backend, using a POST method wth parameter _method = put. This takes a minimum time set in the config of resourcesProvider using the method setWaitTime
         * @example
         * <pre>resources.update('profile', 'http://squidler.com/api/v1/profiles', 'joblogs', {...profile data...})</pre>
         *
         * 
         */
            
        function update(name, api, id, data, silent) {

            var deferred = $q.defer(),
                startTime = new Date().getTime(),
                namedData = {},
                silent = silent ? silent : false;

            namedData[name] = data;
            
            try {
                $ionicPlatform.ready(function () {

                    if ($cordovaNetwork.isOffline()) {

                        exceptions.create('No internet connection', deferred, 'No internet connection',silent)('No internet connection');
                    } else {
                        $http.post(api + "/" + id + "?_method=put", namedData).then(processResponse).catch(exceptions.create('Cannot update ' + name + ' on the server', deferred, 'resources.update fail', silent));
                    }


                });
            } catch(err) {
                
                $http.post(api + "/" + id + "?_method=put", namedData).then(processResponse).catch(exceptions.create('Cannot update ' + name + ' on the server', deferred, 'resources.update fail', silent));
            }


            return deferred.promise;

            ////////////////////////////////////////

            function processResponse(response) {

                var responseTime = new Date().getTime() - startTime;

                if (responseTime <= waitTime) {
                    $timeout(function () {
                        if(response.data.success){
                        deferred.resolve(response.data[name]);}
                        else{
                            deferred.reject(response.data.errors)
                        }
                    }, waitTime - responseTime);
                } else {
                                           if(response.data.success){
                        deferred.resolve(response.data[name]);}
                        else{
                            deferred.reject(response.data.errors)
                        }
                }

            }




        }






    }



    }



})();