(function () {
    'use strict';
    angular
        .module('sqd')
        .provider('credits', creditsProvider);

    creditsProvider.$inject = [];

    function creditsProvider() {

        var api;

        creditsService.$inject = ['$q', 'resources', 'stores', 'exceptions', 'receipts'];

        var provider = {

            setApi: setApi,
            $get: creditsService


        };

        return provider;


        ////////////////////////////////////////

        function setApi(url) {

            api = url;

        }





        /**
         * @ngdoc service
         * @name sqd.service:credits
         * @param {object} $q Angular promise service
         * @param {object} resources Service to communicate with backend resources
         * @param {object} stores Service used to interface with the html5 local storage
         *  @param {object} exceptions Service to catch a failed promise
         *  @param {object} receipts Service to get information on previous purchases
         * @example
         *
         * @returns {object} Service object exposing methods - read
         *
         * @description
         * This is a service that is returned as part of creditsProvider. Used to retrieve redits information and to buy credits
         */

        function creditsService($q, resources, stores, exceptions, receipts) {

        var service = {

            read: read,
            create: create,
            verify : verify

        };

        return service;



        ////////////////////////////////////////

        /**
         * @ngdoc method
         * @name read
         * @methodOf  sqd.service:credits
         * @param {object=} options If it contains the key "refresh" with value true then the credits will be updated from the server
         * @returns {promise} Resolves to an object with keys 'number' telling you the number of credits the current user has
         *
         * @description Retrieves the number of credits that the current user has
         * @example
         * <pre>credits.read()</pre>
         *
         */

        function read(options) {

            var options = options !== undefined ? options : {},
                refresh = options.refresh,
                silent = options.silent !== undefined ? options.silent : false;

            if (refresh) {

                return getCredits().catch(exceptions.create('Problem getting your credits',{silent: silent
                }));


            }
            else {

                return stores.read('credits', 'number').catch(getCredits).catch(exceptions.create('Problem getting your credits', {silent: silent
                }));
            }

            ////////////////////////////////////////

            function getCredits() {

               return stores.read('auth', 'username').then(function(username){
                   return resources.read('credits', api, username).then(postProcess);
                });

                /////////////////////////////


                function postProcess(credits) {

                    stores.update('credits', "number", credits.number);

                    return $q.when(credits.number);


                }


            }

        }

            /**
             * @ngdoc method
             * @name create
             * @methodOf  sqd.service:credits
             * @param {object=} options If it contains the key "refresh" with value true then the credits will be updated from the server
             * @returns {promise} Resolves to an object with keys 'number' telling you the number of credits the current user has
             *
             * @description Creates credits on the server by first going to Google or Apple to do the purchase
             * @example
             * <pre>credits.create()</pre>
             *
             */

            function create(options){

                var options = options!==undefined ? options : {},
                    silent = options.silent!==undefined ? options.silent : false,
                    productId = 'credits_100000',
                    os = ionic.Platform.isAndroid() ? "android" : (ionic.Platform.isIOS() ? "ios" : null);
                    var purchase = {receipt:{}};

                try{
                    return inAppPurchase.getProducts([productId]).then(purchaseCredits).then(consumeCredits).then(verifyCredits).catch(exceptions.create('Problem purchasing your credits', {silent: silent
                    }));
                }

                catch(error){

                 return exceptions.create('Problem purchasing your credits', {silent: silent
                    })(error);
                }


                    ///////////////////////////////////

                    function purchaseCredits(){
                        return inAppPurchase.buy(productId);
                    }

                function consumeCredits(data){

                    purchase.receipt = data;
                    purchase.receipt.os = os;

                    return stores.create('credits','pending',{purchase:purchase}).then(function(){
                        return inAppPurchase.consume(data.productType, data.receipt, data.signature);
                    });

                }

                function verifyCredits(){

                    return stores.update('credits','pending',{state:"consumed"}).then(function(){
                        return resources.create('credits', api, purchase).then(clearPending).then(updateBalance).then(updateReceipts);
                    });


                    ////////////////////////////////


                    function clearPending(){

                        return stores.remove('credits','pending');

                    }

                    function updateBalance(){
                        return read({refresh:true});
                    }

                    function updateReceipts(){
                        return receipts.read({refresh:true});
                    }



                }



            }


            /**
             * @ngdoc method
             * @name verify
             * @methodOf  sqd.service:credits
             * @returns {promise} Resolves if the pending purchases have been verified, otherwise it rejects
             *
             * @description Verifies any pending credits that have been successfully purchased on apple of google but for whaetever reason were not verified on our servers the first time around
             * @example
             * <pre>credits.verify()</pre>
             *
             */



            function verify(options){

                var options = options!==undefined ? options : {},
                    silent = options.silent!==undefined ? options.silent : false,
                    purchase;

                return stores.read('credits','pending').then(function(data){
                    purchase = data.purchase;
                    if(data.state==="consumed"){
                        return $q.when();
                    }
                    else{
                        return inAppPurchase.consume(purchase.productType, purchase.receipt, purchase.signature);
                    }
                }).then(verify).then(clearPending).then(updateBalance).then(updateReceipts).catch(exceptions.create('Problem verifying your last purchase', {silent: silent
                }));

                ////////////////////////////////


                function verify(){
                    return resources.create('credits', api, purchase);
                }

                function clearPending(){

                    return stores.remove('credits','pending')

                }

                function updateBalance(){
                    return read({refresh:true});
                }

                function updateReceipts(){
                    return receipts.read({refresh:true});
                }
            }







    }



    }



})();
