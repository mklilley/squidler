(function () {
    'use strict';
    angular
        .module('sqd')
        .provider('login', loginProvider);

    loginProvider.$inject = [];

    function loginProvider() {

        var api;
        
        loginService.$inject = ['$q', 'exceptions', '$http', 'profiles', 'stores','$cordovaNetwork','$ionicPlatform'];

        var provider = {

            setApi: setApi,
            $get: loginService


        };

        return provider;


        ////////////////////////////////////////

        function setApi(url) {

           api = url;

        }


       

        function loginService($q, exceptions, $http, profiles, stores,$cordovaNetwork,$ionicPlatform) {

        var service = login;

        return service;



        ////////////////////////////////////////



        function login(userData) {
            
             

            var deferred = $q.defer(),
                username = userData ? userData.username.toLowerCase().trim() : 'mklilley',
                password = userData ? userData.password : 'physics',
                data;


                var config = {
                          withCredentials: true
                         };

                data = {
                    username:username,
                    password:password
                };
            
            try {
                $ionicPlatform.ready(function () {
                                     var net = $cordovaNetwork.getNetwork();
                 console.log(net);

                    if ($cordovaNetwork.isOffline()) {

                        exceptions.create('No internet connection', deferred, 'No internet connection')('No internet connection');
                    } else {
                         $http.post(api, data).then(processResponse).catch(exceptions.create('Cannot login user', deferred, 'login fail'));
                    }


                });
            } catch(err) {
                $http.post(api, data).then(processResponse).catch(exceptions.create('Cannot login user', deferred, 'login fail'));
            }
        



            return deferred.promise;

            ////////////////////////////////////////

            function processResponse(response) {
                
                
                
                stores.create('users', 'current', data.username);
                stores.create('users', 'password', data.password);
                
                profiles.read(data.username)
                
                deferred.resolve(response);

                return $q.when(response);

            }

        }










    }



    }



})();