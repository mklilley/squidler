(function () {
    'use strict';
    angular
        .module('sqd')
        .provider('users', usersProvider);

    usersProvider.$inject = [];

    function usersProvider() {

        var api;
        
        usersService.$inject = ['$q', 'resources', 'exceptions'];

        var provider = {

            setApi: setApi,
            $get: usersService


        };

        return provider;


        ////////////////////////////////////////

        function setApi(url) {

           api = url;

        }


        
   /**
         * @ngdoc service
         * @name sqd.service:users
         * @param {object} $q Angular promise service
         * @param {object} resources Service to communicate with backend resources
          * @param {object} exceptions Service to catch a failed promise
         * @returns {object} Service object exposing methods - create, read, update
         *
         * @description
         * This is a service that is returned as part of usersProvider. Used to create, read and update a user's account details. Users can only use this service on their own accounts
         */
        
        function usersService($q, resources, exceptions) {

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
         * @methodOf  sqd.service:users
         * @param {object} data {username:string, email:string, password:string}
         * @returns {promise} Resolves to an object with keys: username, email, verified if user details were successfully read, otherwise the promise is rejected. You must be the user in question to access this data
         * 
         * @description Retrives the private user account information for a specific user 
         * @example
         * <pre>users.read('joblogs')</pre>
         * 
         */

        function create(data) {

            var deferred = $q.defer();

            resources.create('user', api, data).then(postProcess).catch (exceptions.create('Problem creating user', deferred));

            return deferred.promise;

            ////////////////////////////////////////

            function postProcess(response) {

                deferred.resolve(response);

                return $q.when(response);

            }

        }
            
            
            
            
             /**
         * @ngdoc method
         * @name read 
         * @methodOf  sqd.service:users
         * @param {string} username Username
         * @returns {promise} Resolves to an object with keys: username, email, verified if user details were successfully read, otherwise the promise is rejected. You must be the user in question to access this data
         * 
         * @description Retrives the private user account information for a specific user 
         * @example
         * <pre>users.read('joblogs')</pre>
         * 
         */

        function read(userName) {

            var deferred = $q.defer();

             resources.read('user', api, userName).then(postProcess).catch (exceptions.create('Problem reading user', deferred));


            return deferred.promise;

            ////////////////////////////////////////

            function postProcess(response) {

                deferred.resolve(response);

                return $q.when(response);



            }



        }


        function update(userName,data) {


            var deferred = $q.defer();

            resources.update('user', api, userName, data).then(postProcess).catch(exceptions.create('Problem updating user', deferred));

            return deferred.promise;


            ////////////////////////////////////////

            function postProcess(response) {

                deferred.resolve(response);

                return $q.when(response);



            }




        }






    }



    }



})();