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
            update: update,
            destroy: destroy,
            action: action

        };

        return service;



        ////////////////////////////////////////


                    /*
         * @ngdoc method
         * @name create
         * @methodOf sqd.service:resources
         * @param {string} name Primary key used for encoding the  JSON data sent to backend and for reading the response data, e.g. 'squidle'
         * @param {string} api URL of the backend api for the  resource described by 'name', e.g. '/api/1/squidles'
         * @param {object} data Data object specific to the backend resource, see http://#/api/backend_resource_list
         * @param {object=} options {formData:bool,silent:bool} formData is when payload is form not just JSON. silent false means any exceptions will not be displayed to the user via a popup (default is true)
         * @param {bool} silent If set to true then any exceptions will not be displayed to the user
         * @returns {promise} Resolves to an object specific to the backend resource if the resource was created successfully.  Otherwise the promise is rejected with an object of the form {message:string, code:int}

         *
         * @description Creates a resource on the backend, using a POST method. This takes a minimum time set in the config of resourcesProvider using the method setWaitTime
         * @example
         * <pre>resources.create('squidle','http://squidler.com/api/1/squidles', {...squidle data...})</pre>
         *
         *
         */

        function create(name, api, data, options) {

            var deferred = $q.defer(),
                startTime = new Date().getTime(),
                namedData = {},
                config = {},
                options = options!==undefined ? options : {},
                silent = options.silent!==undefined ? options.silent : true,
                payload;

                if(options.formData){
                     config = {transformRequest: angular.identity,headers: {'Content-Type': undefined}};

                    var payload = new FormData();
                    payload.append(name, data);
                }

                else{
                    namedData[name] = data;
                    payload = data;

                }


             $ionicPlatform.ready(function () {

                 try{ 
                     if ($cordovaNetwork.isOffline()) {

                         exceptions.create('No internet connection', {toBeRejected:{promise:deferred,message:'No internet connection'},silent:silent})(new Error('No internet connection'));
                     } else {
                         $http.post(api + "/create", payload, config).then(processResponse).catch(exceptions.create('Cannot create ' + name + ' on the server', {toBeRejected:{promise:deferred,message:'resources.create fail'},silent:silent}));
                     }
                 }

                 catch(err) {


                     $http.post(api + "/create", payload, config).then(processResponse).catch(exceptions.create('Cannot create ' + name + ' on the server', {toBeRejected:{promise:deferred,message:'resources.create fail'},silent:silent}));
                 }




             });









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
                            deferred.reject(response.data.error)
                        }
                    }, waitTime - responseTime);
                } else {
                                           if(response.data.success){
                        deferred.resolve(response.data[name]);}
                        else{
                            deferred.reject(response.data.error)
                        }
                }

            }





        }


                    /*
         * @ngdoc method
         * @name read
         * @methodOf sqd.service:resources
         * @param {string} name Primary key used for reading the response data from the backend, e.g. 'squidle'
         * @param {string} api URL of the backend api for the  resource described by 'name', e.g. '/api/1/squidles'
         * @param {string} id Used to uniquely identify the requested resource, e.g. '8KLv694'
         * @param {object=} params Extra information specific to the backend resource, e.g. {guess:blue} for trying to get the Squidle prize, see http://#/api/backend_resource_list
          * @param {object=} options {silent:bool} silent false means any exceptions will not be displayed to the user via a popup (default is true)
         * @returns {promise} Resolves to an object specific to the backend resource if the resource was read successfully.  Otherwise the promise is rejected with an object of the form {message:string, code:int}
         *
         * @description Reads a resource on the backend, using a GET method. This takes a minimum time set in the config of resourcesProvider using the method setWaitTime
         * @example
         * <pre>resources.read('history', 'http://squidler.com/api/1/users/history', 'joblogs')</pre>
         *
         *
         */
        function read(name, api, id, params, options) {

            var deferred = $q.defer(),
                startTime = new Date().getTime(),
                options = options!==undefined ? options : {},
                silent = options.silent!==undefined ? options.silent : true,
                route =  id ? api + "/" + id : api;

            delete options.silent;
            var config = options;
            config.params = params;

         $ionicPlatform.ready(function () {

             try{
                 if ($cordovaNetwork.isOffline()) {


                     exceptions.create('No internet connection', {toBeRejected:{promise:deferred,message:'No internet connection'},silent:silent})(new Error('No internet connection'));
                 } else {
                     $http.get(route, config).then(processResponse).catch(exceptions.create('Cannot find ' + name + ' on the server', {toBeRejected:{promise:deferred,message:'resources.read fail'},silent:silent}));
                 }
             }

             catch(err) {
                 $http.get(route, config).then(processResponse).catch(exceptions.create('Cannot find ' + name + ' on the server', {toBeRejected:{promise:deferred,message:'resources.read fail'},silent:silent}));
             }

         });


            return deferred.promise;

            ////////////////////////////////////////

            function processResponse(response) {

                var responseTime = new Date().getTime() - startTime;

                if (responseTime <= waitTime) {
                    $timeout(function () {
                        if(response.data.success){
                        deferred.resolve(response.data[name]);}
                        else{
                            deferred.reject(response.data.error)
                        }
                    }, waitTime - responseTime);
                } else {
                                           if(response.data.success){
                        deferred.resolve(response.data[name]);}
                        else{
                            deferred.reject(response.data.error)
                        }
                }

            }



        }

/**
         * @ngdoc method
         * @name update
         * @methodOf sqd.service:resources
         * @param {string} name Primary key used for reading the response data from the backend, e.g. 'squidle'
         * @param {string} api URL of the backend api for the  resource described by 'name', e.g. '/api/1/squidles'
         * @param {string} id Used to uniquely identify the requested resource, e.g. '8KLv694'
         * @param {object} data Data object specific to the backend resource, see http://#/api/backend_resource_list
        *  @param {object=} options {silent:bool} silent false means any exceptions will not be displayed to the user via a popup (default is true)
         * @returns {promise} Resolves to an object specific to the backend resource if the resource was updated successfully.  Otherwise the promise is rejected with an object of the form {message:string, code:int}

         *
         * @description Updates a resource on the backend, using a POST method wth parameter _method = put. This takes a minimum time set in the config of resourcesProvider using the method setWaitTime
         * @example
         * <pre>resources.update('profile', 'http://squidler.com/api/1/users/profile', 'joblogs', {...profile data...})</pre>
         *
         *
         */

        function update(name, api, id, data, options) {

            var deferred = $q.defer(),
                startTime = new Date().getTime(),
                namedData = {},
                options = options!==undefined ? options : {},
                silent = options.silent!==undefined ? options.silent : true,
                payload;

            namedData[name] = data;
            payload = data;


                $ionicPlatform.ready(function () {

                    try{
                        if ($cordovaNetwork.isOffline()) {

                            exceptions.create('No internet connection', {toBeRejected:{promise:deferred,message:'No internet connection'},silent:silent})(new Error('No internet connection'));
                        } else {
                            $http.post(api + "/update/" + id, payload).then(processResponse).catch(exceptions.create('Cannot update ' + name + ' on the server', {toBeRejected:{promise:deferred,message:'resources.update fail'},silent:silent}));
                        }
                    }

                    catch(err) {

                        $http.post(api + "/update/" + id, payload).then(processResponse).catch(exceptions.create('Cannot update ' + name + ' on the server', {toBeRejected:{promise:deferred,message:'resources.update fail'},silent:silent}));
                    }


                });



            return deferred.promise;

            ////////////////////////////////////////

            function processResponse(response) {

                var responseTime = new Date().getTime() - startTime;

                if (responseTime <= waitTime) {
                    $timeout(function () {
                        if(response.data.success){
                        deferred.resolve(response.data[name]);}
                        else{
                            deferred.reject(response.data.error)
                        }
                    }, waitTime - responseTime);
                } else {
                                           if(response.data.success){
                        deferred.resolve(response.data[name]);}
                        else{
                            deferred.reject(response.data.error)
                        }
                }

            }




        }






        /**
                 * @ngdoc method
                 * @name destroy
                 * @methodOf sqd.service:resources
                 * @param {string} name Primary key used for reading the response data from the backend, e.g. 'squidle'
                 * @param {string} api URL of the backend api for the  resource described by 'name', e.g. '/api/v1/squidles'
                 * @param {string} id Used to uniquely identify the requested resource, e.g. '8KLv694'
                *  @param {object=} options {silent:bool} silent false means any exceptions will not be displayed to the user via a popup (defauhlt is true)
                 * @returns {promise} Resolves to an object specific to the backend resource if the resource was updated successfully.  Otherwise the promise is rejected with an object of the form {message:string, code:int}

                 *
                 * @description Destroys a resource on the backend. This takes a minimum time set in the config of resourcesProvider using the method setWaitTime
                 * @example
                 * <pre>resources.destroy('squidle', 'http://squidler.com/api/v1/squidles', '5Ry4fgI')</pre>
                 *
                 *
                 */

                function destroy(name, api, id, options) {

                    var deferred = $q.defer(),
                        startTime = new Date().getTime(),
                        options = options!==undefined ? options : {},
                        silent = options.silent!==undefined ? options.silent : true;


                        $ionicPlatform.ready(function () {

                            try{
                                if ($cordovaNetwork.isOffline()) {

                                    exceptions.create('No internet connection', {toBeRejected:{promise:deferred,message:'No internet connection'},silent:silent})(new Error('No internet connection'));
                                } else {
                                    $http.post(api + "/delete/" + id).then(processResponse).catch(exceptions.create('Cannot destroy ' + name + ' on the server', {toBeRejected:{promise:deferred,message:'resources.destroy fail'},silent:silent}));
                                }
                            }

                            catch(err) {

                                $http.post(api + "/delete/" + id).then(processResponse).catch(exceptions.create('Cannot destroy ' + name + ' on the server',{toBeRejected:{promise:deferred,message:'resources.destroy fail'},silent:silent}));
                            }


                        });



                    return deferred.promise;

                    ////////////////////////////////////////

                    function processResponse(response) {

                        var responseTime = new Date().getTime() - startTime;

                        if (responseTime <= waitTime) {
                            $timeout(function () {
                                if(response.data.success){
                                deferred.resolve(response.data[name]);}
                                else{
                                    deferred.reject(response.data.error)
                                }
                            }, waitTime - responseTime);
                        } else {
                                                   if(response.data.success){
                                deferred.resolve(response.data[name]);}
                                else{
                                    deferred.reject(response.data.error)
                                }
                        }

                    }




                }








                /**
     * @ngdoc method
     * @name action
     * @methodOf sqd.service:resources
     * @param {string} name Primary key used for encoding the  JSON data sent to backend and for reading the response data, e.g. 'squidle'
     * @param {string} action Label for the action you want to perform e.g. "solve"
     * @param {string} id Used to uniquely identify the requested resource that you want to perform the action on, e.g. '8KLv694'
     * @param {string} api URL of the backend api for the  resource described by 'name', e.g. '/api/1/squidles'
     * @param {object} data Data object specific to the backend resource, see http://#/api/backend_resource_list
      * @param {object=} options {formData:bool,silent:bool} formData is when payload is form not just JSON. silent false means any exceptions will not be displayed to the user via a popup (default is true)
     * @returns {promise} Resolves to an object specific to the backend resource if the resource was created successfully.  Otherwise the promise is rejected with an object of the form {message:string, code:int}

     *
     * @description Performs a custom action on the backend, using a POST method. This takes a minimum time set in the config of resourcesProvider using the method setWaitTime
     * @example
     * <pre>resources.action('squidle', 'solve', 'http://squidler.com/api/1/squidles', {...squidle data...})</pre>
     *
     *
     */

    function action(action, name, api, id, data, options) {

        var deferred = $q.defer(),
            startTime = new Date().getTime(),
            namedData = {},
            config = {},
            options = options!==undefined ? options : {},
            silent = options.silent!==undefined ? options.silent : true,
            route =  id ? api + "/" + action +"/" + id : api + "/" + action,
            payload;

                    if(options.formData){
                        config = {transformRequest: angular.identity,headers: {'Content-Type': undefined}};

                        payload = new FormData();
                        payload.append(name, data);
                    }

                    else{
                        namedData[name] = data;
                        payload = data;

                    }



         $ionicPlatform.ready(function () {

             try{
                 if ($cordovaNetwork.isOffline()) {

                     exceptions.create('No internet connection', {toBeRejected:{promise:deferred,message:'No internet connection'},silent:silent})(new Error('No internet connection'));
                 } else {

                     $http.post(route, payload, config).then(processResponse).catch(exceptions.create('Cannot ' + action + " " + name + ' on the server', {toBeRejected:{promise:deferred,message:'resources.action fail'},silent:silent}));
                 }
             }

             catch(err) {



                 $http.post(route, payload, config).then(processResponse).catch(exceptions.create('Cannot ' + action + " " + name + ' on the server', {toBeRejected:{promise:deferred,message:'resources.action fail'},silent:silent}));
             }



         });





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
                        deferred.reject(response.data.error)
                    }
                }, waitTime - responseTime);
            } else {
                                       if(response.data.success){
                    deferred.resolve(response.data[name]);}
                    else{
                        deferred.reject(response.data.error)
                    }
            }

        }





    }









    }



    }



})();
