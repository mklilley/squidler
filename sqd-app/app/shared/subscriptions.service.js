(function () {
    'use strict';
    angular
        .module('sqd')
        .provider('subscriptions', subscriptionsProvider);

    subscriptionsProvider.$inject = [];

    function subscriptionsProvider() {

        var api;

        subscriptionsService.$inject = ['$q', 'exceptions', 'resources', 'stores', 'login', '$rootScope'];
        
        var provider = {

            setApi: setApi,
            $get: subscriptionsService


        };

        return provider;


        ////////////////////////////////////////

        function setApi(url) {

           api = url;

        }


    
        
                                /**
         * @ngdoc service
         * @name sqd.service:subscriptions
         * @param {object} $q Angular promise service
         * @param {object} stores Service used to interface with the html5 local storage
         * @param {object} exceptions Service to catch a failed promise
         * @returns {object} Service object exposing methods - create, read
         *
         * @description
         * This is a service that is returned as part of subscriptionsProvider. Used to deal with creating a subscription or checking whether a user has subscribed through Google Play or the App Store.
         */

        function subscriptionsService($q, exceptions, resources, stores, login, $rootScope) {
            
            var puchaseData;

        var service = {

            create: create,
            read: read,
            verify: verify

        };

        return service;



        ////////////////////////////////////////
            
            
             /**
         * @ngdoc method
         * @name create 
         * @methodOf sqd.service:subscriptions
         * @param {string} username Username to be used to create a Squidler subscription
         *
         * @returns {promise} Resolves if subscription has been successfully created otherwise it is rejected

         * 
         * @description Sends user to Google Play or App store. Once they confirm a subscription the user is returned to Squidler where the subscirption information is sent to Squidler back-end to be stored.
         * @example
         * <pre>subscriptions.create('joblogs')</pre>
         *
         * 
         */



        function create(options) {
            
            if((options||{}).loginDetails){
                
                return login(options.loginDetails)
                
            }
            
            else {
                
                  if(ionic.Platform.isAndroid()) {

   return inAppPurchase.getProducts([options.productId]).then(function(data){
       $rootScope.$broadcast('iap',{message:"Return from getProducts",data:data});
                        console.log('Return from getProducts',data);
         return inAppPurchase
    .buy(options.productId)
    .then(function (data) {
      puchaseData = data;
       $rootScope.$broadcast('iap',{message:"Data from successsful puchase",data:data});
      console.log('data from successsful puchase',data);
      return inAppPurchase.consume(data.productType, data.receipt, data.signature);
    })
    .then(function (data) {
       $rootScope.$broadcast('iap',{message:"Data from successsful consumption",data:data});
       console.log('data from successsful consumption',data)
       /*return login(username)*/

    })
    .catch(function (err) {
      console.log(err);
          $rootScope.$broadcast('iap',{message:"Catching error from buy & consume sequence",data:err});
      return $q.when()
    });
       
   }
   ).catch(function(err){
       console.log(err);
          $rootScope.$broadcast('iap',{message:"Catching error from get",data:err});
      return $q.reject()
       
   })


            }
        
                
                
                
            }
            
              
        
            /*  var MAX_REQUESTS = 3,
                  counter = 1;
            
            return dummyStore().then(saveSubrsciption,subsribeError);*/
            
          


            ////////////////////////////////////////
            
            function dummyStore(){
                
                return $q.when()
            }
            
            function saveSubscription(data){
                
                
                stores.create('subscriptions','username',username);
                stores.create('subscriptions','token',data);
                
                return resources.create('subscriptions',api,data).catch(serverError)
                
                ////////////////////////////////////////
                
                function serverError(){
                                    
                if(counter<=MAX_REQUESTS){
                    
                    counter+=1;
                                        
                    return resources.create('subscriptions',api,data).catch(serverError)
                
                    
                    
                }
                    
                                    
                else {
                    
                    return $q.reject()
                }
                    
                    
                }


                
             
                
            }
            
            function subscribeError(){
                
                return $q.reject()
                
            }



        }
            
            
            
                         /**
         * @ngdoc method
         * @name read 
         * @methodOf sqd.service:subscriptions
         * @param {string} username Username to be used to create a Squidler subscription
         *
         * @returns {promise} Resolves if subscription has been successfully created otherwise it is rejected

         * 
         * @description Checks to see if the user has a valid subscription
         * @example
         * <pre>subscriptions.read()</pre>
         *
         * 
         */
            
            function read(options){
                
                if((options || {}).subscriptions){
                    
                                     if(ionic.Platform.isIOS()) {
                return stores.read('users').then(loginUser)
                
            }
                
                else{
                    
                    return inAppPurchase.getProducts([options.productId]).then(function(data){
                        $rootScope.$broadcast('iap',{message:"Return from getProducts",data:data});
                        console.log('Return from getProducts',data);
       return inAppPurchase.restorePurchases() })
    .then(function (data) {
                         $rootScope.$broadcast('iap',{message:"Return from restorePurchases",data:data});
      console.log('Return from restorePurchases',data);
      
       return $q.when();
                     
    })
    .catch(function (err) {
                        $rootScope.$broadcast('iap',{message:"Catching error from get & restore sequence",data:err});
      console.log('Catching error from get & restore sequence',err);
                    return $q.reject();
    });
                        
                   

                }
                    
                    
                    
                }
                
                else{
                    
                    return stores.read('users').then(loginUser)
                    
                }
                

                
                 
              /* return stores.read('users').then(loginUser)*/
                
                /*return stores.read('subscriptions').then(verifySubscription,noSubscription)*/
                
                
                ////////////////////////////////////////
               
               function loginUser(user) {

                return login({
                    username: user.current,
                    password: user.password
                })

            }
                
                function verifySubscription(data){
                    
                    
                    
                    return resources.read('subscriptions',api,data.username,{token:data.token})
                    
                }
                
                
                function noSubscription(){
                    
                    return $q.reject('No subscription');
                    
                    
                }
                
               
                
                
            }
            
            
                              /**
         * @ngdoc method
         * @name verify 
         * @methodOf sqd.service:subscriptions
         * @param {string} username Username to be used to create a Squidler subscription
         *
         * @returns {promise} Resolves if subscription has been successfully created otherwise it is rejected

         * 
         * @description Checks to see if the user has a valid subscription
         * @example
         * <pre>subscriptions.verify()</pre>
         *
         * 
         */
            
            function verify(options){
                
                resources.create('subscriptions',options.api,puchaseData).then(function(response){
                    
                    
                     $rootScope.$broadcast('iap',{message:"Data received from verificaiton api",data:response});
      console.log('Data received from verificaiton api',response);
                    
                }).catch(function(err){
                    
                     $rootScope.$broadcast('iap',{message:"Error from verification api",data:err});
      console.log('Error from verification api',err);
                    
                    
                });
                    
                    
                }
                
                
            










    }



    }



})();