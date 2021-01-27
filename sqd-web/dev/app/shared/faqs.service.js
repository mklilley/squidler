(function () {
    'use strict';
    angular
        .module('sqd')
        .provider('faqs', faqsProvider);

    faqsProvider.$inject = [];

    function faqsProvider() {

        var api;

        faqsService.$inject = ['$q', 'resources',  'stores', 'exceptions'];

        var provider = {

            setApi: setApi,
            $get: faqsService


        };

        return provider;


        ////////////////////////////////////////

        function setApi(url) {

            api = url;

        }





        /**
         * @ngdoc service
         * @name sqd.service:faqs
         * @param {object} $q Angular promise service
         * @param {object} resources Service to communicate with backend resources
         * @param {object} stores Service used to interface with the html5 local storage
          * @param {object} exceptions Service to catch a failed promise
         *
         * @returns {object} Service object exposing methods - read
         *
         * @description
         * This is a service that is returned as part of faqsProvider. Used to retrieve an up-to-date version of FAQs from the server
         */

        function faqsService($q, resources, stores, exceptions) {

        var service = {

            read: read

        };

        return service;



        ////////////////////////////////////////

        /**
         * @ngdoc method
         * @name read
         * @methodOf  sqd.service:faqs
         * @param {object=} options If it contains the key "refresh" with value true then faqs will be updated before returning, otherwise the locally stored faqs will be returned
         * @returns {promise} Resolves to an array of FAQ objects [{question:....,answer:...}]
         *
         * @description Retrieves the FAQs
         * @example
         * <pre>faqs.read()</pre>
         *
         */

        function read(options) {


            var deferred = $q.defer(),
                options = options!==undefined ? options : {},
                silent = options.silent!==undefined ? options.silent : false,
                tempFaqs;

            if ((options).refresh){

                backupAndClearFaqs().then(getFaqs).catch(exceptions.create('Problem reading the FAQs', {toBeRejected:{promise:deferred,message:'faq.read error'},silent:silent}));

                return deferred.promise;



            }

            else{
               return stores.read('faqs','list').catch(exceptions.create('Problem reading the FAQs', {toBeRejected:{promise:deferred,message:'faq.read error'},silent:silent}));

            }





            ////////////////////////////////////////

 
            function backupAndClearFaqs(){
                return stores.read('faqs','list').then(function(data){
                    tempFaqs = data;
                  return stores.remove('faqs');
                });
            }


            function getFaqs(){


                    return resources.read('faqs', api, undefined, undefined,  { headers: { 'Cache-Control' : 'no-cache' } } ).then(postProcess,restoreOldFaqs);



                ////////////////////////////////////////

                function postProcess(data){

                    stores.create('faqs','list',data);

                    deferred.resolve(data);

                    return $q.when(data);

                }

                function restoreOldFaqs(error){

                    stores.create('faqs','list',tempFaqs);

                  return $q.reject(error);

                }


            }



        }







    }



    }



})();
