(function () {
    'use strict';
    angular
        .module('sqd')
        .factory('exceptions', exceptions);

    exceptions.$inject = ['$rootScope','$ionicLoading','$ionicPopup'];
    
    
        /**
         * @ngdoc service
         * @name sqd.service:exceptions
         * @param {object} $rootScope Angular service to communicating with the rootScope of the app
         * @param {object} $ionicLoading Ionic service to show and hide the loading screen
         * @param {object} $ionicPopup Ionic service to create a popup
         * @returns {object} Service object exposing methods - create
         *
         * @description
         * Service used to catch any errors/exceptions that are produced in a prmomise chain and log the details out to both the console and to log variable on the rootScope
         */


    function exceptions($rootScope,$ionicLoading,$ionicPopup) {



        var service = {

            create: create

        };

        return service;



        ////////////////////////////////////////

                /**
         * @ngdoc method
         * @name create 
         * @methodOf  sqd.service:exceptions
         * @param {string} message Error message to display in the console and in popup
         * @param {promise=} promise A promise to be rejected after the logging of the errors
         * @param {string=} promise_message Error message to pass to the rejection of the promise
         * @param {bool=} silent It true then no popup will display
         * returns {function} Function that can be used as a catch in promise chain
         * 
         * @description Logs errors to the console, saves the details to a log variable and rejects the supplied promise afterwards
         * @example
         * <pre>squidles.create({..data..}).then(doSomething).catch(exceptions.create('Problem creating your Squidle', deferred, 'squidles.create fail'))</pre>
         * 
         */

        function create(message,promise,promise_message,silent){

            return function(reason){

                $ionicLoading.hide();
                
                if(!silent){
                $ionicPopup.alert({
     title: message,
                    okType: "button-assertive"
   });}
                
                console.log(message);
                console.log("Details:", reason);

                $rootScope.log = $rootScope.log ? $rootScope.log : [];
                $rootScope.log.push(reason);

                if(promise){promise.reject(promise_message || '')};

            }
        }

    }







})();