(function () {
    'use strict';
    angular
        .module('sqd')
        .provider('emails', emailsProvider);

    emailsProvider.$inject = [];



    function emailsProvider() {

        var api;
        
        emailsService.$inject = ['$q', 'resources',  'exceptions'];

        var provider = {

            setApi: setApi,
            $get: emailsService


        };

        return provider;


        ////////////////////////////////////////

        function setApi(url) {

            api = url;

        }


        


        /**
         * @ngdoc service
         * @name sqd.service:emails
         * @param {object} $q Angular promise service
         * @param {object} resources Service to communicate with backend resources
          * @param {object} exceptions Service to catch a failed promise
         * @returns {object} Service object exposing methods - create
         *
         * @description
         * This is a service that is returned as part of emailsProvider. Used to send emails to the Squidler team
         */

        function emailsService($q, resources, exceptions) {

            var service = {

                create: create

            };

            return service;



            ////////////////////////////////////////

        /**
         * @ngdoc method
         * @name create 
         * @methodOf  sqd.service:emails
         * @param {object} data {name:string,  email:string,  message:string}
         * @returns {promise} Resolves to an object  - {"message":"The support team will be back to you ASAP."} -  if email was successfully sent, otherwise the promise is rejected
         * 
         * @description Sends an email to the Squidler team 
         * @example
         * <pre>emails.create({name:'Jo', email:'jo@blogs.com', message:'Help me!'})</pre>
         * 
         */

            function create(data) {

                var deferred = $q.defer();

                resources.create('email', api, data).then(postProcess).
                catch(exceptions.create('Problem sending your support email', deferred));


                return deferred.promise;

                ////////////////////////////////////////

                function postProcess(response) {

                    deferred.resolve({success:true});

                    return $q.when({success:true});



                }





            }





        }



    }



})();