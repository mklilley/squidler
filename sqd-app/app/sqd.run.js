(function () {
    'use strict';
    angular
        .module('sqd')
        .run(run);

    run.$inject = ['$ionicPlatform', '$rootScope', '$ionicHistory', '$state', 'users', 'stores', 'history', '$timeout', '$ionicPopup', '$ionicLoading','subscriptions','$q','profiles','$window'];

    function run($ionicPlatform, $rootScope, $ionicHistory, $state, users, stores, history, $timeout, $ionicPopup, $ionicLoading,subscriptions,$q,profiles,$window) {

        $rootScope.alreadyOpen = false;

        //  $state service can be accessed from any scope to allow divs to hide of show depending on the curent state
        $rootScope.$state = $state;

        // Object can be accessed from any scope to allow you to check if an object is empty through Object.keys
          $rootScope.objectKeys = Object.keys;


        stores.create('tempSquidle', 'prize', {
            text: ""
        });
        stores.create('tempSquidle', 'challenge', {
            text: ""
        });
        stores.create('tempSquidle', 'answer', {
            text: ""
        });

        stores.create('preview', 'squidle', {});

        stores.create('profiles','SquidlerTeam',{bio:"We Love to Squidle",avatar:"",first_name:"Squidler Team",location:"London"});

        stores.create('squidles');



        stores.create('usageData','opens',{});
        stores.create('usageData','walkthroughs',{squidles:false,create:false});
        stores.create('usageData','timeLastOpen',{});




        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            if (angular.isObject(error)) {
                switch (error.code) {
                    case 401:
                        // go to the login page
                        $state.go('welcome');
                        break;
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





        $ionicPlatform.registerBackButtonAction(function (e) {


            if ($ionicHistory.backView()) {
                $ionicHistory.goBack();
            } else {

                $ionicPopup.confirm({
                    title: 'Exit Squidler?',
                    okType: "button-energized"
                }).then(function (res) {
                    if (res) {
                        ionic.Platform.exitApp();
                    }
                });

            }
            e.preventDefault();
            return false;
        }, 101);




        $ionicPlatform.ready(function () {

            /*ionic.Platform.isFullScreen = true;*/
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {

               cordova.plugins.Keyboard.disableScroll(true); cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }




            var deepLink = {
                present:false,
                data:""
            };


          if (ionic.Platform.isWebView()) {

                    universalLinks.subscribe('loadSquidle', function (eventData) {

                        deepLink.present = true;
                        deepLink.data =  eventData.url.split("/").pop();

                        if ($rootScope.alreadyOpen){

                        $state.go('main.squidle', {
                            squidleId: deepLink.data
                        });
                        }

                    });
                }

            checkForRegisteredUser(deepLink);



        });




        ////////////////////////////////////////


        function checkForRegisteredUser(deepLink) {

          $ionicLoading.show();
   subscriptions.read().then(carryOn).catch(welcomeNewUser);

            /*stores.read('users').then(loginUser).then(carryOn).catch(welcomeNewUser);*/

            ////////////////////



            function carryOn() {

                $ionicLoading.hide();

                var timeNow = Date.now(),
                    profileUpdateInterval = 86400000;

                $rootScope.alreadyOpen = true;

                stores.read('usageData').then(processUsageData).then(updateProfilesIfNecessary);



                if (deepLink.present){

                    //history.read();

                    $state.go('main.squidle', {
                            squidleId: deepLink.data
                        });
                }

                else {



                   /* goToSquidles();*/

                    ///history.read().then(goToSquidles).catch(goToSquidles);


                    $state.go('main.squidles');

                }


                ////////////////////

                function processUsageData(data){


                    var needToUpdateProfiles = (timeNow - (data.timeLastOpen.timeStamp || 0) ) > profileUpdateInterval ? true:false;


                     stores.update('usageData','opens',{number:data.opens.number+1});

                    stores.update('usageData','timeLastOpen',{timeStamp:timeNow});

                    if(needToUpdateProfiles){return $q.when()}
                    else{return $q.reject()}

                }

                function updateProfilesIfNecessary(){

                    profiles.read(undefined,{refresh:true}).then(function(dat){console.log(dat)});
                }

/*                    function goToSquidles(){
                         $ionicLoading.hide();
                        $state.go('main.squidles');

                    }*/



            }

            function welcomeNewUser() {


                $ionicLoading.hide();

                $state.go('welcome');

            }


        }







    }


})();
