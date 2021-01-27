(function () {
    'use strict';
    angular
        .module('sqd')
        .factory('exceptions', exceptions);

    exceptions.$inject = ['$rootScope','$ionicLoading','$ionicPopup','$q', '$ionicPlatform', '$cordovaClipboard'];


        /**
         * @ngdoc service
         * @name sqd.service:exceptions
         * @param {object} $rootScope Angular service to communicating with the rootScope of the app
         * @param {object} $ionicLoading Ionic service to show and hide the loading screen
         * @param {object} $ionicPopup Ionic service to create a popup
         * @param {object} $q Angular promise service
         * @param {object} $ionicPlatform ionics service to tell if the app is loaded
         * @param {object} $cordova Clipboard Cordova clipboard copying service
         * @returns {object} Service object exposing methods - create
         *
         * @description
         * Service used to catch any errors/exceptions that are produced in a prmomise chain and log the details out to both the console and to log variable on the rootScope
         */


    function exceptions($rootScope,$ionicLoading,$ionicPopup,$q, $ionicPlatform, $cordovaClipboard) {



        var service = {

            create: create

        };

        return service;



        ////////////////////////////////////////

                /**
         * @ngdoc method
         * @name create
         * @methodOf  sqd.service:exceptions
         * @param {string} message Error message to display in the console and in popup (if silent=false in options)
         * @param {object=} options {toBeRejected:{promise:..., message:...},silent:...} toBeRejected - A promise to be rejected and a message to pass to that promise, silent - If true then no popup will display with an error message and details
         * returns {function} Function that can be used as a catch in promise chain
         *
         * @description Logs errors to the console, saves the details to a log variable, displays a popup with the error and rejects the supplied promise afterwards
         * @example
         * <pre>squidles.create({..data..}).then(doSomething).catch(exceptions.create('Problem creating your Squidle', {toBeRejected:{promise:somePromise, message:'squidles.create fail'},silent:true}))</pre>
         *
         */

        function create(message,options){

                    var options = options!==undefined ? options : {},
                        promise = (options.toBeRejected||{}).promise,
                        promise_message = (options.toBeRejected||{}).message,
                        silent = options.silent!==undefined ? options.silent : false,
                        template;

            return function(reason){

                $ionicLoading.hide();

                if(!silent){
                    var details = "<br><br><details><summary>Details</summary>"+JSON.stringify(reason)+"</details>";
                    if(typeof reason === "string"){
                        template = reason;
                    }
                    else if(typeof reason === "object"){
                        if(reason instanceof Error){
                            template = reason.message + details;
                        }
                            else if(reason.details instanceof Error){
                            template = reason.details.message + details;
                        }
                        else{
                            template = reason.details.data === null ? "There appears to be a connection problem" + details : ((reason.details.data||{}).error||"") +  details
                          }

                    }
                $ionicPopup.alert({
     title: message,
                    template:template,
                    okType: "button-assertive"
   });}

                try {
                    $ionicPlatform.ready(function () {

                        $cordovaClipboard.copy(JSON.stringify(reason))

                    });
                }
                catch (err) {
                }

                console.log(message);
                console.log("Details:", reason);

                $rootScope.log = $rootScope.log ? $rootScope.log : [];
                $rootScope.log.push(reason);

                if(promise){promise.reject({message:promise_message, details:reason} || '')}
                else{
                    return $q.reject();
                }

            }
        }

    }










})();
