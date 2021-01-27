(function () {
    'use strict';
    angular
        .module('sqd')
        .run(run);

    run.$inject = ['$ionicPlatform', '$rootScope', '$ionicHistory', '$state', 'stores', 'history', '$timeout', '$ionicPopup', '$ionicLoading','$q','profiles','$window', 'faqs'];

    function run($ionicPlatform, $rootScope, $ionicHistory, $state, stores, history, $timeout, $ionicPopup, $ionicLoading,$q,profiles,$window, faqs) {
        

        //  $state service can be accessed from any scope to allow divs to hide of show depending on the curent state
        $rootScope.$state = $state;

        // Object can be accessed from any scope to allow you to check if an object is empty through Object.keys
          $rootScope.objectKeys = Object.keys;

        // Attach history to rootScope so it can be accessed in any view
        $rootScope.history = $ionicHistory.viewHistory();

        $rootScope.BASE = "https://squidler.com";

        stores.create('version');

        stores.read("version","current").then(function(version){

            //potentially do some cleaning of local storage if someone has had an old version
            stores.update("version","current","1.0.0");

        }).catch(function(error){
            stores.create("version","current","1.0.0");
        });

        stores.create('profiles');
        //stores.create('profiles');
        stores.create('squidles');
        stores.create('faqs','list',{});
        stores.create('usageData','opens',{timeLastOpen:0, number:0});
        stores.create('credits','number',0);

        //stores.create('auth');
        stores.create('auth','username',"guest");
        //profiles.read('mklilley');



        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            if (angular.isObject(error)) {
                switch (error.code) {
                    case 401:
                        // go to the login page
                        $state.go('welcome');
                        break;
                    case 404:
                          $state.go('welcome');
                         $window.location.href = $rootScope.BASE+"/w/"+error.path;
                        //$state.go('blank');
                    default:
                        // set the error object on the error state and go there
                        /* $state.get('error').error = error;
                         $state.go('error');*/
                }
            } else {
                // unexpected error
                /* $state.go('error');*/
            }
        });


                $rootScope.$on('reset', function () {
             $state.go('welcome');
       $window.location.reload();
        });






         $ionicPlatform.ready(function () {

            /*ionic.Platform.isFullScreen = true;*/
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {

               cordova.plugins.Keyboard.disableScroll(true); cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }



             stores.read('usageData','opens').then(doUpdatesIfNecessary);

             //$state.go('welcome');


        });




        ///////////////////////////////////////


        function doUpdatesIfNecessary(data){

            var timeNow = Date.now(),
                profileUpdateInterval = 86400000,
                faqUpdateInterval = 2419200000;

            stores.update('usageData','opens',{number:data.number+1, timeLastOpen:timeNow});

            var needToUpdateProfiles = (timeNow - (data.timeLastOpen || 0) ) > profileUpdateInterval ? true:false,
                needToUpdateFaqs = (timeNow - (data.timeLastOpen || 0) ) > faqUpdateInterval ? true:false;

            if(needToUpdateProfiles){
                profiles.read(undefined,{refresh:true,silent:true});
            }
            if(needToUpdateFaqs){
                faqs.read({refresh:true,silent:true});
            }

            return $q.when();


        }













    }


})();
