(function () {
'use strict';
    angular
            .module('sqd',['ionic','ngCordova','ionic-cache-src', 'ngAnimate', 'templates','menu','welcome','blank','ngStorage']);




})();

(function () {
    'use strict';
    angular
        .module('sqd')
        .config(config);



    config.$inject = ['$httpProvider','$stateProvider', '$urlRouterProvider', '$locationProvider', 'squidlesProvider', 'resourcesProvider', 'historyProvider', 'emailsProvider',  'profilesProvider', '$compileProvider', '$sceProvider', '$cacheSrcProvider', 'faqsProvider', 'creditsProvider', 'receiptsProvider'];

    function config($httpProvider,$stateProvider, $urlRouterProvider, $locationProvider, squidlesProvider, resourcesProvider, historyProvider, emailsProvider, profilesProvider, $compileProvider, $sceProvider, $cacheSrcProvider, faqsProvider, creditsProvider, receiptsProvider) {

        var base = 'https://squidler.com';
        //var base = 'http://web.squidler.com';
        var fileBase = "https://squidler.com";
        //var fileBase = "http://web.squidler.com";

        $urlRouterProvider.otherwise(otherwise);

        otherwise.$inject = ['$injector','$location'];

        function otherwise($injector,$location){
            var short = $location.url().split("/").pop();
            if(short!==""){
                return "/main/squidles/"+short;
            }
            else{
                    return "/welcome";
            }

        }



        $httpProvider.interceptors.push(['$rootScope', '$q', function ($rootScope, $q) {
        return {
            request: function (config) {
                config.timeout = 15000;
                return config;
            }
        }
         }]);

        // $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
        //     return {
        //           'responseError': function(response) {
        //             if(response.status === 401 || response.status === 403) {
        //                 $location.path('/blank');
        //             }
        //             return $q.reject(response);
        //         }
        //     };
        // }]);


         squidlesProvider.setApi(base + '/api/1/squidle');


        historyProvider.setApi(base + '/api/1/user/history');

        creditsProvider.setApi(base + '/api/1/user/credits');

        receiptsProvider.setApi(base + '/api/1/user/receipts');

        resourcesProvider.setWaitTime(1);

        emailsProvider.setApi(base + '/api/1/support');

        profilesProvider.setApi(base + '/api/1/user/profile');



        faqsProvider.setApi(fileBase + '/faq.json');


        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|sms|mailto|twitter|whatsapp|file):/);


         $cacheSrcProvider
              .set({color:'#FBAB00'})
         .set({expire:172800});




          $locationProvider
  .html5Mode(true);
    }



        angular
        .module('sqd')
        .constant('$ionicLoadingConfig',{
  templateUrl: "app/components/loading/loading.html",
            delay:300,
            duration:30000
});


})();

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

(function () {
    'use strict';
    angular
        .module('sqd')
        .controller('SqdController', SqdController)

    SqdController.$inject = ['$state', '$scope', 'stores', 'params'];


    function SqdController($state, $scope, stores, params) {

        var self = this;


    }




})();
(function () {
    'use strict';
    angular
        .module('sqd')
        .factory('params', params);
    
    function params(){
    
    
        var constants = {
            
            menu:menu,
            create:create,
            welcome:welcome,
            squidles: squidles,
            walkthroughs: walkthroughs
        
        }
        
        return constants
        
        
        ////////////////////////////////////////
        
        
        function menu(){
        
        var items = [
        {sref: "main.help",
         title: "Help and Support"},
            {sref: "main.info",
                title: "About"}
        ];
            
            
            
            return {
                items:items
            }
        
        }
        
        
        
        function create(){
        
        var nextText = {
            prize: "Next",
            challenge: "Next",
            answer: "Lock"
        };
            
            var panelText = {
                prize: "Choose what to send",
                challenge: "Lock it with a question",
                answer: "Your answer is the key"
            };
            
            var placeholderText = {
                prize: "Text and links go here",
                challenge:"Question goes here. You can also add links to content",
                answer:"Let's not make it too easy for them, muhahahaha!"
            };
            

            
            return {
                nextText: nextText,
                panelText: panelText,
                placeholderText:placeholderText
            }
        
        }
        
        
        function welcome(){
        
        var logos = ["img/logo_orange.svg", "img/logo_red.svg","img/logo_yellow.svg"];
            
            return {
            logos: logos
            }
        
        }
        
        function squidles(){
            
             var defaultAvatar = "img/avatar.jpg";
            
            return {
            defaultAvatar: defaultAvatar
            }
            
            
        }
        
        function walkthroughs(){
            
         var create = "You can paste a link to an image, animation or video - the content will be attached (jpg/png/imgur/gif/gifv/YouTube)";
            
            var squidles = "We've sent you a Squidle. It is locked (you haven't solved it yet) and it will expire in 24 hours. Tap to view, hold or swipe to share or see Squidle stats.";

            var credits = "Tap here to buy Squids. Use them to get hints to Squidles you receive and to make the Squidles you send harder for your friends"
            
            
                        return {
                squidles:squidles,
                            create:create,
                            credits:credits
            }
            
        }
        
        

        
        
        
        
    }
    
    
    
    
    
    


})();



(function () {
'use strict';
    angular
            .module('menu',['ui.router','squidles','help','info']);




})();
(function () {
    'use strict';
    angular
        .module('menu')
        .config(config);

    config.$inject = ['$stateProvider', '$sceProvider', '$ionicConfigProvider'];

    function config($stateProvider, $sceProvider, $ionicConfigProvider) {
        
         $ionicConfigProvider.backButton.text('').previousTitleText(false);


        $stateProvider
            .state('main',
                  { url: "/main",
                   abstract:true,
                   views: {
                app: {
                         templateUrl: 'app/interfaces/menu/menu.html',
                controller: 'MenuController as menu'
      }},
                        resolve: {
                historyReady: historyReady
                }

                  });

$sceProvider.enabled(false);



    }
    
        historyReady.$inject = ['history'];

    function historyReady(history){
        return //history.read('mklilley');
    }
    
    



})();

(function () {
    'use strict';
    angular
        .module('sqd')
        .controller('MenuController', MenuController)

    MenuController.$inject = ['$scope', '$rootScope','$state', '$ionicLoading', 'stores', 'profiles', 'params', '$ionicPlatform', '$ionicHistory','$localStorage', '$ionicSideMenuDelegate', '$ionicPopup', '$location'];


    function MenuController($scope, $rootScope,$state, $ionicLoading, stores, profiles, params, $ionicPlatform, $ionicHistory,$localStorage, $ionicSideMenuDelegate, $ionicPopup, $location) {

        var self = this;

        self.items = [];
        self.user = {};


        self.downloadSquidler = downloadSquidler;
        self.path = path;



        $scope.$on('$ionicView.enter', function () {

            var back = ($ionicHistory.viewHistory().backView || {}).stateName;
            if (['welcome','blank'].indexOf(back) > -1) {

                $ionicHistory.clearHistory();

            }
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                expire: 300
            });
        });

        $scope.$on('profileUpdated', updateProfile);

        $scope.$on('$ionicView.enter', function () {
            $ionicSideMenuDelegate.canDragContent(false);
        });



        activate();



        ////////////////////

        function activate() {


            self.items = params.menu().items;


            updateProfile();

        }

        function updateProfile(){

                    stores.read('auth', 'username').then(readProfile);

            //////////////////////

            function readProfile(username) {
                self.username = username;
                 profiles.read(username).then(function (profile) {
                    self.avatar = profile.avatar;
                     self.name = profile.name;
                });
            }



        }


        function downloadSquidler(){

            // $ionicPopup.alert({
            //     title: "Coming very soon!",
            //     template: "Squidler will be available from Google Play and the App Store in a couple of weeks",
            //     okType: "button-energized"
            // });

            if(ionic.Platform.isIOS()){
                window.open('https://itunes.apple.com/us/app/squidler/id1133896864?ls=1&mt=8', '_system', 'location=yes');
            }
            else if(ionic.Platform.isAndroid()){
                window.open('https://play.google.com/store/apps/details?id=com.squidler', '_system', 'location=yes');
            }
            else{
                 $ionicPopup.alert({
                     title: "Sorry",
                     template: "Squidler is only currently available for Android and iOS",
                     okType: "button-assertive"
                 })
            }


        }

        function path(){
            return $location.path();
        }











    }




})();

(function () {
'use strict';
    angular
            .module('squidles',['ui.router']);




})();
(function () {
    'use strict';
    angular
        .module('squidles')
        .config(config);

    config.$inject = ['$stateProvider', '$sceProvider'];

    function config($stateProvider, $sceProvider) {

      //   $stateProvider
      //       .state('main.squidles', {
      //       url: "/squidles",
      //           views: {
      //               main: {
      //                   templateUrl: 'app/components/squidles/squidles.html',
      //                   controller: 'SquidlesController as squidles'
      // }}
      //
      //       })
       var file = ionic.Platform.isIOS() ? "squidle-ios.html" : "squidle.html";
        $stateProvider.state('main.squidle', {
    url: "/squidles/:squidleId",
    views: {
      main: {
        templateUrl: 'app/components/squidles/'+file,
          controller: 'SquidleController as squidle'
      }
    },
                      resolve: {
                          squidleExists: squidleExists
                      }
  });
        



    }

    squidleExists.$inject = ['squidles', '$stateParams', '$q', '$ionicLoading'];

    function squidleExists(squidles, $stateParams, $q, $ionicLoading) {
        $ionicLoading.show();
        return squidles.read({short: $stateParams.squidleId}, {silent: true}).then(function () {
            $ionicLoading.hide();
            return $q.resolve();
        }).catch(function () {
            $ionicLoading.hide();
            return $q.reject({code: 404,path:$stateParams.squidleId});
        });

    }
    
    
    
    
     angular
        .module('squidles')
        .constant('$ionicLoadingConfig',{
  templateUrl: "app/components/loading/loading.html",
          delay:300
});


})();

(function() {
  'use strict';
  angular
    .module('squidles')
    .controller('SquidlesController', SquidlesController)

  SquidlesController.$inject = ['$rootScope', '$scope', '$state', '$interval', 'squidles', 'stores', 'time', 'params', 'history', '$ionicPopup', '$ionicListDelegate', 'profiles', '$timeout'];


  function SquidlesController($rootScope, $scope, $state, $interval, squidles, stores, time, params, history, $ionicPopup, $ionicListDelegate, profiles, $timeout) {

    var self = this;




    $scope.$on('$ionicView.beforeEnter', function() {
      activate();
    });





    $scope.$on('$destroy', function() {

      if (self.timer) {
        $interval.cancel(self.timer);
      }
    });


    self.goToSquidle = goToSquidle;
    self.countDown = countDown;
    self.startTimer = startTimer;
    self.createSquidle = createSquidle;



    ////////////////////////////////////////

    function activate() {

      self.list = self.list ? self.list : [];
      self.listIds = self.listIds ? self.listIds : {};


        stores.read('profiles').then(readSquidles);


      ////////////////////

      function readSquidles(profileData) {

        angular.forEach(self.list, function(value, key) {
          if (time.remaining(value.expiresAt) <= 0) {

            stores.remove('squidles', value.id,undefined,{silent:true});
            removeSquidleFromList(value.id);

          }
        });

        squidles.read().then(function(data) {

          angular.forEach(data, function(value, key) {
            var s = {};
            s.username = value.op;
            s.description = value.challenge.text.value;
            s.id = value.short;
            s.avatar = profileData[value.op].avatar;
            s.name = profileData[value.op].name;
            s.sent = value.sent;
            s.hasAttachment = 'video' in value.challenge || 'photo' in value.challenge;
            s.alreadyAnswered = 'prize' in value;
            s.expiresAt = value.expiresAt;
            s.timeRemaining = time.remaining(value.expiresAt);


            if (s.timeRemaining <= 0) {

              stores.remove('squidles', s.id,undefined,{silent:true});

              removeSquidleFromList(s.id);



            } else {

              if (self.listIds[s.id] == undefined) {
                self.list.push(s);
                self.listIds[s.id] = self.list.length - 1;
              } else {
                Object.assign(self.list[self.listIds[s.id]], s);
              }
            }



          });



          self.startTimer();
        });


      }





    }

    function createSquidle() {
      $ionicPopup.alert({
        title: "Glad you like Squidler!",
        template: "Please send us a message via the help section in the menu to request an invite to download the full app",
        okType: "button-positive"
      }).then(function(){
        $state.go('main.help');
      });
    }

    function goToSquidle(short) {

      $state.go('main.squidle', {
        squidleId: short
      });

    }






    function countDown(timeRemaining) {

      return time.hourMinSec(timeRemaining).string


    }



    function startTimer() {

      self.timer = self.timer ? self.timer : $interval(function() {

        angular.forEach(self.list, function(value, key) {

          value.timeRemaining -= 1;

          if (value.timeRemaining <= 0) {

            removeSquidleFromList(value.id);

            stores.remove('squidles', s.id,undefined,{silent:true});

          }

        });





      }, 1000);

    }








    function removeSquidleFromList(short) {

      if (self.listIds[short] != undefined) {
        self.list.splice(self.listIds[short], 1);
        self.listIds = {};

        angular.forEach(self.list, function(value, key) {
          self.listIds[value.id] = key;
        });
      }

    }






  }






})();

(function () {
    'use strict';
    angular
        .module('squidles')
        .controller('SquidleController',SquidleController)

    SquidleController.$inject = ['$scope', '$rootScope', '$state', 'squidles', 'stores', '$stateParams','$ionicLoading', '$ionicSlideBoxDelegate', '$ionicModal', '$ionicPopup', '$ionicHistory', 'time', '$interval', '$timeout', '$ionicPlatform', '$cordovaClipboard','$ionicScrollDelegate', '$q'];


    function SquidleController($scope, $rootScope, $state, squidles, stores, $stateParams, $ionicLoading, $ionicSlideBoxDelegate, $ionicModal, $ionicPopup, $ionicHistory, time, $interval, $timeout, $ionicPlatform, $cordovaClipboard,$ionicScrollDelegate, $q){

        var self = this;

        self.data = {};


        self.alreadyAnswered = false;
        self.prizeDisplayed = false;
        self.validGuess = true;
        self.adjustForIos = ionic.Platform.isIOS() ? {top:'20px'}:{};
        self.fullScreen = {height:(window.innerHeight-96)+"px",
            position:"relative"};




        self.toggleSwipe = toggleSwipe;
        self.makeGuess = makeGuess;
        self.createSquidle = createSquidle;
        self.showPrize = showPrize;
        self.processSquidle = processSquidle;
        self.slideHasChanged = slideHasChanged;
        self.countDown = countDown;
        self.startTimer = startTimer;
        self.lock = lock;
        self.copyText = copyText;
        self.resetFullScreenImage = resetFullScreenImage;
        self.getHint = getHint;
        self.report = report;


        $scope.$on('$destroy', function() {

            if(self.timer){
                $interval.cancel(self.timer);}
        });

        $scope.$on('submit-guess', function() {

            self.makeGuess();
        });

        $ionicModal.fromTemplateUrl('app/components/squidles/fullscreenModal.html', {
            scope: $scope
        }).then(function(modal) {
            self.fullscreen = modal;
        });

        self.openFullscreen = function() {
            self.fullscreen.show();
            self.fullScreenOpen = true;
        };


        self.closeFullscreen = function() {
            self.fullscreen.hide().then(function(){
                self.fullScreenOpen = false;
                self.resetFullScreenImage();


            });

        };

        //Cleanup the popup when we're done with it!
        $scope.$on('$destroy', function() {
            self.fullscreen.remove();

            window.removeEventListener('native.keyboardshow', keyboardShow);

            window.removeEventListener('native.keyboardhide', keyboardHide);
        });









        activate();

        ////////////////////////////////////////

        function toggleSwipe(bool){

            $ionicSlideBoxDelegate.enableSlide(bool);

        }

        function activate(){


            if($stateParams.squidleId=="preview"){

                stores.read('preview').then(function(preview){

                    self.isPreview = true;

                    self.data = preview.squidle;
                    self.guess = preview.squidle.answer.text.value;
                    self.answerHeight = calcAnswerHeight(self.guess);

                    self.toggleSwipe(self.isPreview);

                });

            }

            else{

                window.addEventListener('native.keyboardshow', keyboardShow);
                window.addEventListener('native.keyboardhide', keyboardHide);

                self.guess = "";


                $ionicLoading.show();
                squidles.read({short:$stateParams.squidleId}).then(function(squidle){

                    $ionicLoading.hide();

                    $stateParams.squidleId = squidle.short;

                    var timeRemaining = time.remaining(squidle.expiresAt);

                    if(timeRemaining<=0){

                        squidleExpired();

                    }

                    else{

                        self.data = angular.copy(squidle);

                        self.answerHeight = calcAnswerHeight(self.data.answer.text.value);

                        self.noMoreHints = self.data.answer.text.value.indexOf("\u005F") == -1 ? true : false;

                        if(self.data.prize){
                            self.alreadyAnswered = true;



                        }
                        else{
                            self.data.timeRemaining = timeRemaining;

                            self.startTimer();



                        }


                    }




                    self.isPreview = false;

                    self.toggleSwipe(self.alreadyAnswered);

                }).catch(function(){

                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    });
                    $state.go('welcome');
                });

            }

        }

        function keyboardShow(){
            if(ionic.Platform.isIOS()){
                self.keyboardShow=true;}
        }

        function keyboardHide(){
            if(ionic.Platform.isIOS()){
                self.keyboardShow=false;}

        }

        function makeGuess(){

            if(self.squidleForm.$valid){

                $ionicLoading.show();

                var guessData = {
                    short:$stateParams.squidleId,
                    guess:self.guess

                }
                squidles.read(guessData).then(postProcess).catch(severDownOrSquidleDeleted);

            }

            else{
                $ionicPopup.alert({
                    title: "Empty guess",
                    okType: "button-assertive"
                });
            }

            return

            ////////////////////////////////////////

            function postProcess(response){

                $ionicLoading.hide();

                self.validGuess = true;

                $interval.cancel(self.timer);

                if(response.prize){

                    self.alreadyAnswered = true;
                    self.data.prize = response.prize;
                    $ionicSlideBoxDelegate.next();
                    self.toggleSwipe(self.alreadyAnswered);
                    self.pause = true;
                    $scope.$broadcast('pause');
                }
                else{
                    self.validGuess = false;
                    $ionicPopup.alert({
                        title: ":-( Wrong Answer",
                        okType: "button-assertive"
                    });
                }



            }



            function severDownOrSquidleDeleted(error) {

                if(error.details.status === 404){
                    $interval.cancel(self.timer);
                    stores.remove('squidles', $stateParams.squidleId).then(function () {

                        $ionicHistory.nextViewOptions({
                            historyRoot: true
                        });
                        $state.go('welcome');

                    });
                }

            }



        }

        function createSquidle(){

            $ionicPopup.confirm({
                title: "Glad you like Squidler!",
                template: "To create your own Squidles you'll need to download our FREE app",
                okType: "button-energized"
            }).then(function(res){
                if(res) {
                    // $ionicPopup.alert({
                    //     title: "Coming very soon!",
                    //     template: "Squidler will be available from Google Play and the App Store in a couple of weeks",
                    //     okType: "button-energized"
                    // });

                    if (ionic.Platform.isIOS()) {
                        window.open('https://itunes.apple.com/us/app/squidler/id1133896864?ls=1&mt=8', '_system', 'location=yes');
                    }
                    else if (ionic.Platform.isAndroid()) {
                        window.open('https://play.google.com/store/apps/details?id=com.squidler', '_system', 'location=yes');
                    }
                    else {
                        $ionicPopup.alert({
                            title: "Sorry",
                            template: "Squidler is only currently available for Android and iOS",
                            okType: "button-assertive"
                        })
                    }


                }


            });

        }

        function showPrize(){

            $ionicSlideBoxDelegate.next();
            self.prizeDisplayed = true;

        }

        function processSquidle(){

            $ionicHistory.goBack();
            $scope.$on('$ionicView.afterLeave', function(){
                $rootScope.$broadcast('processSquide');

            });

        }

        function slideHasChanged(index){
            self.prizeDisplayed = index==1 ? true : false;
            $scope.$broadcast('pause');

        }

        function countDown(timeRemaining) {

            return time.hourMinSec(timeRemaining).string


        }

        function startTimer() {

            self.timer = self.timer ? self.timer : $interval(function () {



                self.data.timeRemaining -= 1;

                if (self.data.timeRemaining <= 0) {



                    squidleExpired();



                }




            }, 1000);

        }

        function squidleExpired(){

            stores.remove('squidles', $stateParams.squidleId);

            self.outOfTime = $ionicPopup.alert({
                title: "Sorry, you've run out of time :-(",
                okType: "button-assertive"
            });

            self.outOfTime.then(function(){
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                $state.go('welcome');
            });

            $timeout(function() {
                self.outOfTime.close();
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                $state.go('welcome');
            }, 2000);

            $interval.cancel(self.timer);

        }


        function lock(){


            stores.remove('squidles',$stateParams.squidleId,['prize'])

            self.alreadyAnswered = false;
            self.toggleSwipe(false);

            activate();

        }



        function copyText(text){


            try{  $ionicPlatform.ready(function() {

                $cordovaClipboard
                    .copy(text)
                    .then(function () {
                        $ionicPopup.alert({
                            title: 'Text copied :-)',
                            okType: "button-assertive"
                        });
                    }, function () {
                        $ionicPopup.alert({
                            title: 'Failed to copy text :-(',
                            okType: "button-assertive"
                        });
                    });

            }); }
            catch(err){
                $ionicPopup.alert({
                    title: 'Failed to copy Text :-(',
                    okType: "button-assertive"
                });

            }





        }

        function calcAnswerHeight(text){

            var style;

            if(text && text!=""){

                var numLines = (text.length / 17 >> 0) + 1;
                var ems = Math.max(numLines, 2.5);

                style= {height: ems.toString() + 'em'};

            }
            else {
                style = {height:'2.5em'};
            }

            return style

        }

        function resetFullScreenImage(){

            $ionicScrollDelegate.$getByHandle('fullScreenImage').zoomTo(1);
            $ionicScrollDelegate.$getByHandle('fullScreenImage').scrollTop();

        }


        function getHint() {

            $ionicPopup.confirm({
                title: "Glad you like Squidler!",
                template: "To get hints you'll need to download our FREE app",
                okType: "button-energized"
            }).then(function(res){
                if(res) {

                    // $ionicPopup.alert({
                    //     title: "Coming very soon!",
                    //     template: "Squidler will be available from Google Play and the App Store in a couple of weeks",
                    //     okType: "button-energized"
                    // });

                    if (ionic.Platform.isIOS()) {
                        window.open('https://itunes.apple.com/us/app/squidler/id1133896864?ls=1&mt=8', '_system', 'location=yes');
                    }
                    else if (ionic.Platform.isAndroid()) {
                        window.open('https://play.google.com/store/apps/details?id=com.squidler', '_system', 'location=yes');
                    }
                    else {
                        $ionicPopup.alert({
                            title: "Sorry",
                            template: "Squidler is only currently available for Android and iOS",
                            okType: "button-assertive"
                        })
                    }


                }
            });

        }



        function report(){
            $state.go('main.help',{message:"Inappropriate content on Squidle with id "+$stateParams.squidleId});
        }





    }




})();

(function () {

    angular
        .module('squidles')
        .directive('sqdPause', sqdPause)

    sqdPause.$inject = [];
    
       /**
         * @ngdoc directive
         * @name squidles.directive:sqdPause
         * @restrict A
         * @element iframe
         *
         * @description
         * Allows an iframe to be programatically paused by broadcasting the event 'pause' to the scope using  $scope.$broadcast('pause')
         */

    function sqdPause() {

        var directive = {
            restrict: 'A',
            link: link
        };

        return directive

        ////////////////////////////////////////

        function link(scope, element, attrs) {


            
            scope.$on('pause', pause);
    
                ////////////////////////////////////////
            
            function pause(){
                
                var iframe = element[0].contentWindow;
                    
 iframe.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
    
     

            
            }




            }


        }

        }

    
)();
(function () {
'use strict';
    angular
            .module('info',['ui.router']);




})();
(function () {
    'use strict';
    angular
        .module('info')
        .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {

        $stateProvider
            .state('main.info', {
            url: "/info",
                views: {
                    main: {
                        templateUrl: 'app/components/info/info.html',
                        controller: 'InfoController as info'
      }}

            })



    }


})();

(function () {
'use strict';
    angular
            .module('info')
            .controller('InfoController',InfoController)

    InfoController.$inject = ['params', '$ionicScrollDelegate', 'stores'];


    function InfoController(params, $ionicScrollDelegate, stores){

        var self = this;

        self.changeLogo = changeLogo;
        self.pageDown = pageDown;


        activate();


        ///////////////////////////


        function activate(){

            stores.read('version','current').then(function(version){
               self.version = version;
            });

            self.logos = params.welcome().logos;

            var numLogos = self.logos.length;

            self.logoIndex = Math.random()/(1.0/parseFloat(numLogos))>>0;

            self.logo = self.logos[self.logoIndex];
        }



        function changeLogo(){

            var numLogos = self.logos.length;

            self.logoIndex  = (self.logoIndex + 1)%numLogos;

            self.logo = self.logos[self.logoIndex];


        }


        function pageDown(pageNumber){
            $ionicScrollDelegate.scrollTo(0, (window.innerHeight-44)*pageNumber, true)
        }


    }




})();
(function () {
'use strict';
    angular
            .module('help',['ui.router']);




})();
(function () {
    'use strict';
    angular
        .module('help')
        .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {

        $stateProvider
            .state('main.help', {
                url: "/help?message&email&name",
                views: {
                    main: {
                        templateUrl: 'app/components/help/help.html',
                        controller: 'HelpController as help'
      }}

            })



    }
    
    
     angular
        .module('help')
        .constant('$ionicLoadingConfig',{
  templateUrl: "app/components/loading/loading.html",
          delay:300
});


})();

(function () {
'use strict';
    angular
            .module('help')
            .controller('HelpController',HelpController)

    HelpController.$inject = ['$scope', '$ionicModal', '$ionicLoading', '$ionicPopup', 'emails','faqs', '$stateParams'];


    function HelpController($scope, $ionicModal, $ionicLoading, $ionicPopup, emails, faqs, $stateParams){
        
        var self = this;
        


        self.toggleFAQ = toggleFAQ;
        self.isFAQShown = isFAQShown;
        self.submitQuestion = submitQuestion;
        self.refresh = refresh;
        
        activate();

        $scope.$on('$ionicView.enter', function () {
                if ($stateParams.message) {
                    self.question.message = $stateParams.message;
                    self.askQuestion.show();
                }
            }
        );
        
        
        
        ////////////////////////////////////////
        
        function activate(){

            self.question = {
                name:"",
                email:"",
                message:""
            };

            faqs.read().then(function(data){
                self.FAQs = data;
            });
                          
        $ionicModal.fromTemplateUrl('app/components/help/askQuestionModal.html', {
            scope: $scope
        }).then(function (modal) {
            self.askQuestion = modal;
        });
                            

   
                            
        }


        function refresh() {

            var options = {
                refresh: true
            };

            faqs.read(options).then(function(data) {
                self.FAQs = data;
                $scope.$broadcast('scroll.refreshComplete');
            }).catch(function() {
                $scope.$broadcast('scroll.refreshComplete');

            });

        }


        
        function toggleFAQ(FAQ) {
    if (self.isFAQShown(FAQ)) {
      self.shownFAQ = null;
    } else {
      self.shownFAQ = FAQ;
    }
  }
  function isFAQShown(FAQ) {
    return self.shownFAQ === FAQ;
  }
        
        function submitQuestion(){
            
            if(self.helpForm.$valid){
                
            $ionicLoading.show();

                emails.create(self.question).then(function(){
                    $ionicLoading.hide();
                    self.askQuestion.hide();
                    $ionicPopup.alert({
                        title: "Thanks!",
                        template: "We've received your message",
                        okType: "button-energized"
                    });
                    self.askQuestion.remove().then(function(){
                        activate();
                    });


                });



            }

            else {

                var errorText="";


                angular.forEach(self.helpForm.$error,function(value,key){

                    switch(key) {

                        case "required":
                            errorText = "You need to complete the form";

                            break;
                        case "email":
                            errorText = "Sorry, you've not entered a valid email address";
                            break;

                        case "maxlength":
                            errorText = "Sorry, you've entered more than the 2000 character limit";
                            break;
                        default:
                            break;

                    }


                });


                $ionicPopup.alert({
                    title: "Oops!",
                    template: errorText,
                    okType: "button-assertive"
                });
            }
            

            
        
        }


    }




})();
(function () {
'use strict';
    angular
            .module('welcome',['ui.router']);




})();
(function () {
    'use strict';
    angular
        .module('welcome')
        .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {

        $stateProvider
            .state('welcome', {
                url: "/welcome",
                views: {
                    app: {
                        templateUrl: 'app/components/welcome/welcome.html',
                        controller: 'WelcomeController as welcome'
                    }
                }

            });


    }
    



})();
(function () {
    'use strict';
    angular
        .module('welcome')
        .controller('WelcomeController', WelcomeController)

    WelcomeController.$inject = ['$scope', '$rootScope', '$state', '$stateParams','$ionicSlideBoxDelegate', '$ionicModal', '$timeout','$ionicHistory', '$ionicPopup', 'history', '$ionicLoading', 'params','stores','squidles', '$ionicScrollDelegate'];


    function WelcomeController($scope, $rootScope, $state, $stateParams, $ionicSlideBoxDelegate, $ionicModal, $timeout,$ionicHistory, $ionicPopup, history, $ionicLoading, params,stores,squidles, $ionicScrollDelegate) {

        var self = this;


        self.next = next;
        self.previous = previous;
        self.slideChanged = slideChanged;
        self.changeLogo = changeLogo;
        self.downloadSquidler = downloadSquidler;
        self.pageDown = pageDown;


        



        activate();


        ////////////////////

        function activate(){


            
            self.logos = params.welcome().logos;
            
            var numLogos = self.logos.length; 
            
            self.logoIndex = Math.random()/(1.0/parseFloat(numLogos))>>0;
            
            self.logo = self.logos[self.logoIndex];

        }

        function next() {
            $ionicSlideBoxDelegate.next();
        }

        function previous() {
            $ionicSlideBoxDelegate.previous();
        }

        function slideChanged(index) {
            self.activeSlide = index;
        }




        
        function downloadSquidler(){

            // $ionicPopup.alert({
            //     title: "Coming very soon!",
            //     template: "Squidler will be available from Google Play and the App Store in a couple of weeks",
            //     okType: "button-energized"
            // });

            if(ionic.Platform.isIOS()){
                window.open('https://itunes.apple.com/us/app/squidler/id1133896864?ls=1&mt=8', '_system', 'location=yes');
            }
            else if(ionic.Platform.isAndroid()){
                window.open('https://play.google.com/store/apps/details?id=com.squidler', '_system', 'location=yes');
            }
            else{
                $ionicPopup.alert({
                    title: "Sorry",
                    template: "Squidler is only currently available for Android and iOS",
                    okType: "button-assertive"
                })
            }

        }

            function pageDown(pageNumber){
                $ionicScrollDelegate.scrollTo(0, window.innerHeight*pageNumber, true)
        }









        
        
        function changeLogo(){


           
            var numLogos = self.logos.length; 
            
            self.logoIndex  = (self.logoIndex + 1)%numLogos;
            
            self.logo = self.logos[self.logoIndex];
            
            //self.debugMode = true;
            
            
           // subscriptions.create();
        
        }
        

        
        




    }




})();
(function () {
'use strict';
    angular
            .module('blank',['ui.router']);




})();
(function () {
    'use strict';
    angular
        .module('blank')
        .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {

        $stateProvider
            .state('blank', {
                url: "/blank",
                views: {
                    app: {
                        templateUrl: 'app/components/blank/blank.html'
                    }
                }

            });


    }
    



})();
(function () {
    'use strict';
    angular
        .module('sqd')
        .provider('squidles', squidlesProvider);

    squidlesProvider.$inject = [];

    function squidlesProvider() {

        var api;

     squidlesService.$inject = ['$q', '$rootScope', 'resources', 'files','stores', 'profiles', 'exceptions', 'credits'];

        var provider = {

            setApi: setApi,
            $get: squidlesService


        };

        return provider;



        ////////////////////////////////////////


        function setApi(url) {

            api = url;

        }



             /**
         * @ngdoc service
         * @name sqd.service:squidles
         * @param {object} $q Angular promise service
         * @param {object} $rootScope Angular rootScope service
         * @param {object} resources Service to communicate with backend resources
         * @param {object} files Service used to upload image files to the backend
         * @param {object} stores Service used to interface with the html5 local storage
         * @param {object} profiles Service used to retrieve and update a user's profile
         * @param {object} exceptions Service to catch a failed promise
         * @param {object} credits Service to update users credits after a hint has been received
         * @returns {object} Service object exposing methods - create, read, update
         *
         * @description
         * This is a service that is returned as part of squidlesProvider. Used to create, read and updates squidles
         */

        function squidlesService($q, $rootScope, resources, files, stores, profiles, exceptions, credits) {

            var service = {

                create: create,
                read: read,
                update: update,
                remove: remove,
                updatable: updatable,
                getHint:   getHint

            };

            return service;

            ////////////////////////////////////////


             /**
         * @ngdoc method
         * @name create
         * @methodOf sqd.service:squidles
         * @param {object} squidle Object containing all the squidle data. Main keys: challenge, prize, answer. Sub keys: text photo, video.  Each Sub key must have at least a value key. Answer can only have a text key (see backend api for more details)
         *
         * @returns {promise} Resolves to an object that contains all the original squidle data in adition to the following keys: short, op, expiresAt (see backend squidles api for more details), if the squidle is successfully created, otherwise the promise is rejected. Note, photo values must either be urls from the web or base64 dataURIs which will be converted to jpeg and uploaded to the squidler server
         *
         * @description Creates a squidle
         * @example
         * <pre>squidles.create(
       challenge: {
           text: {
               value: 'What is my favourite colour'
           },
           photo: {
               value: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
               uploaded: true
           }
       },
       prize: {
           text: {
               value: 'When everyone in the office has a cough'
           },
           video: {
               value: 'https://youtu.be/IVFHyZSXKMw'
           }
       },
       answer: {
           text: {
               value: 'blue',
               hint: '••••'
           }
       })</pre>
         *
         *
         */

            function create(squidle,options) {

                var deferred = $q.defer(),
                    options = options!==undefined ? options : {},
                    silent = options.silent!==undefined ? options.silent : false;

                $q.all([processAnswer(squidle), processFiles(squidle)]).then(createSquidle).catch(exceptions.create('Problem creating your Squidle',{toBeRejected:{promise:deferred},silent:silent}));

                return deferred.promise;

                ////////////////////////////////////////

                function processAnswer(squidle){

                    var A = squidle.answer.text.value.toLowerCase().trim();

                    // dots
                    // var H = A.replace(/[a-zA-Z0-9áéíÍóÓäÁëÉöÓúÚàèììùåÅÄÖ]/g, "\u2022");

                    // box
                    // var H = A.replace(/[a-zA-Z0-9áéíÍóÓäÁëÉöÓúÚàèììùåÅÄÖ]/g, "\u2610");

                    // Underscore
                     //var H = A.replace(/[a-zA-Z0-9áéíÍóÓäÁëÉöÓúÚàèììùåÅÄÖ]/g, "\u005F ");

                    // Underscore
                   //var H = A.replace(/\S/gi, "\u005F ");



                    //A = A.replace(/ /g, "").toLowerCase();


                    squidle.answer.text.value = A;
                    //squidle.answer.text.hint = H;



                    return $q.when(squidle);
                }

                function processFiles(squidle) {

                       var hasFiles = ((squidle.prize.photo || {}).uploaded) || ((squidle.challenge.photo || {}).uploaded);

                    var data = [];

                    if(hasFiles){return extractFilesFromSquidle(squidle).then(uploadFiles).then(insertFileLinkIntoSquidle);}

                    else{return $q.when(squidle);}


                    ////////////////////////////////////////

                    function extractFilesFromSquidle(squidle) {


                        if ((squidle.prize.photo || {}).uploaded) {
                            data.push({
                                data: squidle.prize.photo.value,
                                label: 'prize'
                            });
                        }

                        if ((squidle.challenge.photo || {}).uploaded) {
                            data.push({
                                data: squidle.challenge.photo.value,
                                label: 'challenge'
                            });
                        }

                        return $q.when(data)

                    }

                    function uploadFiles(data){

                        return files.create(data);

                    }

                    function insertFileLinkIntoSquidle(uploaded){

                            for (var i=0; i<uploaded.length; i++){

                            squidle[data[i].label].photo.value = uploaded[i].url;
                            }
                       return $q.when(squidle);

                    }




                }

                function createSquidle(squidle){

                    squidle = squidle.constructor === Array ? squidle[0] : squidle;

                    return resources.create('squidle',api,squidle).then(postProcess);

                    ////////////////////////////////////////

                    function postProcess(squidle){

                        var id = squidle.short,
                            username = squidle.op;

                        delete squidle.prize;

                        squidle.sent = true;
                        squidle.stats = {};

                        stores.remove('preview', 'squidle');
                        stores.create('preview', 'squidle', {});

                        stores.remove('tempSquidle', 'prize');
                        stores.create('tempSquidle', 'prize', {text: ""});
                        stores.remove('tempSquidle', 'challenge');
                        stores.create('tempSquidle', 'challenge', {text: ""});
                        stores.remove('tempSquidle', 'answer');
                        stores.create('tempSquidle', 'answer', {text: ""});

                         return profiles.read(squidle.op).then(function(opProfile){

                                squidle.op = username;

                             angular.forEach(squidle.challenge,function(value,key){
                                 squidle.challenge[key] = {value:value};
                             });
                             angular.forEach(squidle.prize,function(value,key){
                                 squidle.prize[key] = {value:value};
                             });

                             squidle.answer = {text:{value: squidle.answer}};

                                stores.create('squidles', id, squidle);


                                deferred.resolve(squidle);


                            });



                      /*  stores.create('squidles', id, squidle);

                        deferred.resolve(squidle);

                        return $q.when(squidle);*/

                    }


                }









            }

                         /**
         * @ngdoc method
         * @name read
         * @methodOf sqd.service:squidles
         * @param {object=} squidle Must contain the key "short", i.e. the id of the squidle to be read.  If "guess" key is also present the a request will be made to retrive the prize of the squidle. If no squidle is presented then all stored squidles will be returned
         *
         *
         * @returns {promise} Resolves to an object that contains the following keys: challenge, answer (only the hints), short, op, expiresAt.  If a guess is provided and is correct the object contains a prize and short keys. If the squidle cannot be read or the answer provided is incorrect the promise is rejected. (see backend squidles api for more details). If no squidle is presented then all stored squidles will be returnd as an object whose keys are the shortlink
         * @example
         * <pre>squidles.read({short:'VJ08tg6', guess:'blue'})</pre>
         *
         *
         */


            function read(squidle,options) {


                var deferred = $q.defer(),
                    options = options!==undefined ? options : {},
                    silent = options.silent!==undefined ? options.silent : false;

                if(squidle){

                if(squidle.guess){processGuess(squidle).then(tryToGetPrize).catch(exceptions.create('Problem getting your prize',{toBeRejected:{promise:deferred},silent:silent}));}

                else{getSquidle(squidle).catch(exceptions.create('Problem getting your Squidle',{toBeRejected:{promise:deferred},silent:silent}));}
                }
                else{

                    getAllSquidles().catch(exceptions.create('Problem getting your Squidles',{toBeRejected:{promise:deferred},silent:silent}));
                }

                return deferred.promise;

                ////////////////////////////////////////

                function processGuess(squidle){
                   // squidle.guess =  squidle.guess.toLowerCase().replace(/ /g, '');
                    squidle.guess =  squidle.guess.toLowerCase().trim();

                    return $q.when(squidle);
                }

                function tryToGetPrize(squidle) {

                    return resources.action('solve','squidle', api, squidle.short, {guess: squidle.guess}).then(postProcess,wrongAnswer);

                    ////////////////////////////////////////

                    function postProcess(squidle) {

                        var id = squidle.short;

                        angular.forEach(squidle.prize,function(value,key){
                            squidle.prize[key] = {value:value};
                        });

                        stores.update('squidles', id, squidle);

                        deferred.resolve(squidle);

                        return $q.when(squidle);

                    }

                    function wrongAnswer(response){

                           if(response.details.status == 403){

                        deferred.resolve(response);
                        return $q.when();
                        }
                        else{
                            if(response.details.status === 404){
                                response.details.data.error = "Sorry, this Squidle was deleted by its creator";
                            }
                            deferred.reject(response);
                            return $q.reject(response);
                        }
                    }


                }

                function getAllSquidles(){

                    return stores.read('squidles').then(function(squidles){

                        deferred.resolve(squidles);

                        return $q.when(squidles);

                    });


                }




                function getSquidle(squidle){


                    var id = squidle.short;

                    if(id){
                    return stores.read('squidles', id).then(useStoredSquidle,getNewSquidle);}
                    else{
                    return $q.reject('No squidle id presented')
                    }


                    ////////////////////////////////////////

                    function useStoredSquidle(squidle){

                        deferred.resolve(squidle);

                        return $q.when(squidle);

                    }

                    function getNewSquidle(){
                        return resources.read('squidle', api, id).then(postProcess).then(getProfileData);

                        ////////////////////////////////////////


                    function postProcess(squidle){

                        angular.forEach(squidle.challenge,function(value,key){
                            squidle.challenge[key] = {value:value};
                        });
                        angular.forEach(squidle.prize,function(value,key){
                            squidle.prize[key] = {value:value};
                        });

                        squidle.answer = {text:{value: squidle.answer}};


                        return stores.read("auth","username").then(function(username){
                            squidle.sent = squidle.op == username;
                            return $q.when(squidle);
                        });

                    }

                        function getProfileData(squidle){

                            return profiles.read(squidle.op).then(function(opProfile){

                                var id = squidle.short;

                                squidle.stats = {};

                                stores.create('squidles', id, squidle);

                                deferred.resolve(squidle);


                            });


                        }


                    }


                }






            }


             /**
         * @ngdoc method
         * @name update
         * @methodOf sqd.service:squidles
         * @param {object} squidle Object containing the squidle data to be updated. This must include a "short" key to identify the squidle to be updated. To update hint an "answer" and "hintOn" key must be present, hintOn = true sets hints to be consistent with  answer.text.value, hintsOn=false removes the hint altogether. To update expiry an "expiresAt" key must be present with sub keys: interval (e.g. 'hour', 'day', 'week') and units (integer)
          * @param {string} field Name of the part of the squidle to be updated, currently only 'expiry' or 'hint'
         *
         * @returns {promise} Resolves to an object that contains the following keys: challenge, answer, short, op, expiresAt, if the squidle was updated successfuly, oterwise the promise is rejected. (see backend squidles api for more details)
         *
         * @description Updates a Squidle
         * @example
         * <pre>squidles.update({
         * short:VJ08tg6,
         *hintsOn:true,
         *answer:{
         *text:{
         *value:'blue',
         *hint:••••}}})</pre>
         *
         *
         */



            function update(squidle,field,options) {

                var options = options!==undefined ? options : {},
                    silent = options.silent!==undefined ? options.silent : false;

                switch (field.toLowerCase()) {
                case 'expiry':
                   return processExpiry(squidle).then(updateSquidle).catch(exceptions.create('Problem updating your Squidle',{silent:silent}));
                    break;
                case 'hint':
                   return processHint(squidle).then(updateSquidle).catch(exceptions.create('Problem updating your Squidle',{silent:silent}));
                    break;
                default:
                    break;
                }


                ////////////////////////////////////////

                function processExpiry(squidle){

                    var interval = squidle.expiresAt.interval,
                        units = squidle.expiresAt.units;

                    squidle.expiresAt = createTimeStamp(interval, units);


                    return $q.when(squidle);

                ////////////////////////////////////////

                    function createTimeStamp(interval, units) {
                        var d = new Date();

                        switch (interval.toLowerCase()) {
                        case 'minute':
                            d.setTime(d.getTime() + units * 60000);
                            d = Math.floor(d.getTime()/1000);
                            break;
                        default:
                            break;
                        }

                        return d
                    }


                }

               function processHint(squidle){


                   squidle.hintsOn = squidle.hintsOn ? 1 : 0;

                //     var A = squidle.answer.text.value.trim().replace(/ /g, "").toLowerCase();
                //     // dots
                //    // var H = A.replace(/[a-zA-Z0-9áéíÍóÓäÁëÉöÓúÚàèììùåÅÄÖ]/g, "\u2022");
                   //
                //    //box
                //    // var H = A.replace(/[a-zA-Z0-9áéíÍóÓäÁëÉöÓúÚàèììùåÅÄÖ]/g, "\u2610");
                   //
                //    // Underscore
                //    //var H = A.replace(/[a-zA-Z0-9áéíÍóÓäÁëÉöÓúÚàèììùåÅÄÖ]/g, "\u005F ");
                   //
                //    // Underscore
                //    var H = A.replace(/\S/gi, "\u005F ");
                   //
                   //
                //    if (squidle.hintsOn){
                   //
                //     squidle.answer = {text:{
                //     value:A,
                //         hint:H
                //     }};
                //            }
                   //
                //            else{
                   //
                //    squidle.answer = {text:{
                //     value:A,
                //         hint:""
                //     }};
                //            }



                           return $q.when(squidle);




                }


                function updateSquidle(squidle){



                    var id = squidle.short;
                    delete squidle.short;


                     return resources.update('squidle',api,id,squidle).then(postProcess).then(updateCredits);

                    ////////////////////////////////////////

                    function postProcess(squidle){

                        delete squidle.prize;
                        angular.forEach(squidle.challenge,function(value,key){
                            squidle.challenge[key] = {value:value};
                        });

                        squidle.answer = {text:{value: squidle.answer}};

                       return  stores.update('squidles',id,squidle)


                    }

                    function updateCredits(){

                        return credits.read({refresh:true});


                    }
                }



            }


                         /**
         * @ngdoc method
         * @name remove
         * @methodOf sqd.service:squidles
         * @param {object} squidle Must contain the key "short",  i.e. the id of the squidle to be removed and a the key "sent" indicating whether the user sent this squidle or received it.
         *
         * @returns {promise} Resolves if squidle was successfully removed and rejects otherwise
         *
         * @description Removes a squidle. If you are the OP then it removes it from the server entirely, otherwise it just removes it from your history on the device and the server
         * @example
         * <pre>squidles.remove({short:'VJ08tg6',sent:true})</pre>
         *
         *
         */


            function remove(squidle,options){

                var options = options!==undefined ? options : {},
                    silent = options.silent!==undefined ? options.silent : false,
                  id = squidle.id,
                    sent = squidle.sent;
                    if(id){

                        if(sent)
                            {
                                return resources.destroy('squidle',api,id).then(removeFromPhone).catch(exceptions.create('Problem removing your Squidle',{silent:silent}));
                            }
                            else{
                                return removeFromPhone();
                            }



                    }
                    else{

                    return $q.reject('No squidle id presented')
                    }



                ////////////////////////////////////////


                function removeFromPhone(){


                    return stores.remove('squidles', id)

                }



            }


                 /**
                  * @ngdoc method
                  * @name updatable
                  * @methodOf sqd.service:squidles
                  * @param {string} short Short link for the squidle you want to check on
                  *
                  * @returns {promise} Resolves to true if the squidle can be updated, otherwise it resolves to false
                  *
                  * @description Checkes to see if a squidle can be updated be the OP. If someone has already seen the squidle then further updates are blocked
                  * @example
                  * <pre>squidles.updatable('VJ08tg6')</pre>
                  *
                  *
                  */


                 function updatable(short,options){

                    var deferred = $q.defer(),
                        options = options!==undefined ? options : {},
                        silent = options.silent!==undefined ? options.silent : false;

                     resources.read('squidle',api + "/updatable",short).then(postProcess).catch(exceptions.create('Problem reading update status of your Squidle',{toBeRejected:{promise:deferred},silent:silent}));

                     return deferred.promise;

                     ////////////////////////////////////////

                     function postProcess(response){

                         stores.update('squidles',short,response);
                         deferred.resolve(response.updatable);
                         return $q.when();

                     }



                 }


                 /**
                  * @ngdoc method
                  * @name getHint
                  * @methodOf sqd.service:squidles
                  * @param {string} short Short link for the squidle you want to get a hint on
                  *
                  * @returns {promise} Resolves if a hint was successfully received otherwise it rejects
                  *
                  * @description Gets a hint for a Squidle and updates the locally stored squidle data accordingly
                  * @example
                  * <pre>squidles.getHint('VJ08tg6')</pre>
                  *
                  *
                  */

                 function getHint(short,options){

                     var options = options!==undefined ? options : {},
                         silent = options.silent!==undefined ? options.silent : false;

                     return resources.read('squidle',api + "/hint",short).then(postProcess).then(updateCredits).catch(exceptions.create('Problem getting a hint for this Squidle',{silent:silent}));

                     ////////////////////////////////////////

                     function postProcess(response){

                         response.answer = {text:{value: response.answer}};

                         stores.update('squidles',short,response).then(function(){

                             return $q.when(response);
                         });


                     }

                     function updateCredits(){

                         return credits.read({refresh:true});

                     }

                 }




        }



    }









})();

(function () {
    'use strict';
    angular
        .module('sqd')
        .provider('resources', resourcesProvider);

    resourcesProvider.$inject = [];

    function resourcesProvider() {

        var waitTime;

         resourcesService.$inject = ['$q', '$http',  '$timeout','exceptions', '$cordovaNetwork', '$ionicPlatform'];

        var provider = {

            setWaitTime: setWaitTime,
            $get: resourcesService


        };

        return provider;


        ////////////////////////////////////////

        function setWaitTime(time_ms) {

            waitTime = time_ms;

        }


                /**
         * @ngdoc service
         * @name sqd.service:resources
         * @param {object} $q Angular promise service
         * @param {object} $http Angular http service
         * @param {object} $timeout Angular timeout service
         * @param {object} exceptions Service to catch a failed promise
         * @param {object} $cordovaNetwork ngCordova Service to tell if the network is avaiable or not
         * @param {object} $ionicPlatform Ionic platform service
         * @returns {object} Service object exposing methods - create, read, update
         *
         * @description
         * This is a service that is returned as part of resourcesProvider. Used to communicte with all squidler backend resources
         */

        function resourcesService($q, $http, $timeout, exceptions, $cordovaNetwork, $ionicPlatform) {




        var service = {

            create: create,
            read: read,
            update: update,
            destroy: destroy,
            action: action

        };

        return service;



        ////////////////////////////////////////


                    /*
         * @ngdoc method
         * @name create
         * @methodOf sqd.service:resources
         * @param {string} name Primary key used for encoding the  JSON data sent to backend and for reading the response data, e.g. 'squidle'
         * @param {string} api URL of the backend api for the  resource described by 'name', e.g. '/api/1/squidles'
         * @param {object} data Data object specific to the backend resource, see http://#/api/backend_resource_list
         * @param {object=} options {formData:bool,silent:bool} formData is when payload is form not just JSON. silent false means any exceptions will not be displayed to the user via a popup (default is true)
         * @param {bool} silent If set to true then any exceptions will not be displayed to the user
         * @returns {promise} Resolves to an object specific to the backend resource if the resource was created successfully.  Otherwise the promise is rejected with an object of the form {message:string, code:int}

         *
         * @description Creates a resource on the backend, using a POST method. This takes a minimum time set in the config of resourcesProvider using the method setWaitTime
         * @example
         * <pre>resources.create('squidle','http://squidler.com/api/1/squidles', {...squidle data...})</pre>
         *
         *
         */

        function create(name, api, data, options) {

            var deferred = $q.defer(),
                startTime = new Date().getTime(),
                namedData = {},
                config = {},
                options = options!==undefined ? options : {},
                silent = options.silent!==undefined ? options.silent : true,
                payload;

                if(options.formData){
                     config = {transformRequest: angular.identity,headers: {'Content-Type': undefined}};

                    var payload = new FormData();
                    payload.append(name, data);
                }

                else{
                    namedData[name] = data;
                    payload = data;

                }


             $ionicPlatform.ready(function () {

                 try{ 
                     if ($cordovaNetwork.isOffline()) {

                         exceptions.create('No internet connection', {toBeRejected:{promise:deferred,message:'No internet connection'},silent:silent})(new Error('No internet connection'));
                     } else {
                         $http.post(api + "/create", payload, config).then(processResponse).catch(exceptions.create('Cannot create ' + name + ' on the server', {toBeRejected:{promise:deferred,message:'resources.create fail'},silent:silent}));
                     }
                 }

                 catch(err) {


                     $http.post(api + "/create", payload, config).then(processResponse).catch(exceptions.create('Cannot create ' + name + ' on the server', {toBeRejected:{promise:deferred,message:'resources.create fail'},silent:silent}));
                 }




             });









/*             $timeout(function () {
                        deferred.resolve(namedData);
                    }, waitTime);*/


            return deferred.promise;

            ////////////////////////////////////////

            function processResponse(response) {

                var responseTime = new Date().getTime() - startTime;

                if (responseTime <= waitTime) {
                    $timeout(function () {
                        if(response.data.success){
                        deferred.resolve(response.data[name]);}
                        else{
                            deferred.reject(response.data.error)
                        }
                    }, waitTime - responseTime);
                } else {
                                           if(response.data.success){
                        deferred.resolve(response.data[name]);}
                        else{
                            deferred.reject(response.data.error)
                        }
                }

            }





        }


                    /*
         * @ngdoc method
         * @name read
         * @methodOf sqd.service:resources
         * @param {string} name Primary key used for reading the response data from the backend, e.g. 'squidle'
         * @param {string} api URL of the backend api for the  resource described by 'name', e.g. '/api/1/squidles'
         * @param {string} id Used to uniquely identify the requested resource, e.g. '8KLv694'
         * @param {object=} params Extra information specific to the backend resource, e.g. {guess:blue} for trying to get the Squidle prize, see http://#/api/backend_resource_list
          * @param {object=} options {silent:bool} silent false means any exceptions will not be displayed to the user via a popup (default is true)
         * @returns {promise} Resolves to an object specific to the backend resource if the resource was read successfully.  Otherwise the promise is rejected with an object of the form {message:string, code:int}
         *
         * @description Reads a resource on the backend, using a GET method. This takes a minimum time set in the config of resourcesProvider using the method setWaitTime
         * @example
         * <pre>resources.read('history', 'http://squidler.com/api/1/users/history', 'joblogs')</pre>
         *
         *
         */
        function read(name, api, id, params, options) {

            var deferred = $q.defer(),
                startTime = new Date().getTime(),
                options = options!==undefined ? options : {},
                silent = options.silent!==undefined ? options.silent : true,
                route =  id ? api + "/" + id : api;

            delete options.silent;
            var config = options;
            config.params = params;

         $ionicPlatform.ready(function () {

             try{
                 if ($cordovaNetwork.isOffline()) {


                     exceptions.create('No internet connection', {toBeRejected:{promise:deferred,message:'No internet connection'},silent:silent})(new Error('No internet connection'));
                 } else {
                     $http.get(route, config).then(processResponse).catch(exceptions.create('Cannot find ' + name + ' on the server', {toBeRejected:{promise:deferred,message:'resources.read fail'},silent:silent}));
                 }
             }

             catch(err) {
                 $http.get(route, config).then(processResponse).catch(exceptions.create('Cannot find ' + name + ' on the server', {toBeRejected:{promise:deferred,message:'resources.read fail'},silent:silent}));
             }

         });


            return deferred.promise;

            ////////////////////////////////////////

            function processResponse(response) {

                var responseTime = new Date().getTime() - startTime;

                if (responseTime <= waitTime) {
                    $timeout(function () {
                        if(response.data.success){
                        deferred.resolve(response.data[name]);}
                        else{
                            deferred.reject(response.data.error)
                        }
                    }, waitTime - responseTime);
                } else {
                                           if(response.data.success){
                        deferred.resolve(response.data[name]);}
                        else{
                            deferred.reject(response.data.error)
                        }
                }

            }



        }

/**
         * @ngdoc method
         * @name update
         * @methodOf sqd.service:resources
         * @param {string} name Primary key used for reading the response data from the backend, e.g. 'squidle'
         * @param {string} api URL of the backend api for the  resource described by 'name', e.g. '/api/1/squidles'
         * @param {string} id Used to uniquely identify the requested resource, e.g. '8KLv694'
         * @param {object} data Data object specific to the backend resource, see http://#/api/backend_resource_list
        *  @param {object=} options {silent:bool} silent false means any exceptions will not be displayed to the user via a popup (default is true)
         * @returns {promise} Resolves to an object specific to the backend resource if the resource was updated successfully.  Otherwise the promise is rejected with an object of the form {message:string, code:int}

         *
         * @description Updates a resource on the backend, using a POST method wth parameter _method = put. This takes a minimum time set in the config of resourcesProvider using the method setWaitTime
         * @example
         * <pre>resources.update('profile', 'http://squidler.com/api/1/users/profile', 'joblogs', {...profile data...})</pre>
         *
         *
         */

        function update(name, api, id, data, options) {

            var deferred = $q.defer(),
                startTime = new Date().getTime(),
                namedData = {},
                options = options!==undefined ? options : {},
                silent = options.silent!==undefined ? options.silent : true,
                payload;

            namedData[name] = data;
            payload = data;


                $ionicPlatform.ready(function () {

                    try{
                        if ($cordovaNetwork.isOffline()) {

                            exceptions.create('No internet connection', {toBeRejected:{promise:deferred,message:'No internet connection'},silent:silent})(new Error('No internet connection'));
                        } else {
                            $http.post(api + "/update/" + id, payload).then(processResponse).catch(exceptions.create('Cannot update ' + name + ' on the server', {toBeRejected:{promise:deferred,message:'resources.update fail'},silent:silent}));
                        }
                    }

                    catch(err) {

                        $http.post(api + "/update/" + id, payload).then(processResponse).catch(exceptions.create('Cannot update ' + name + ' on the server', {toBeRejected:{promise:deferred,message:'resources.update fail'},silent:silent}));
                    }


                });



            return deferred.promise;

            ////////////////////////////////////////

            function processResponse(response) {

                var responseTime = new Date().getTime() - startTime;

                if (responseTime <= waitTime) {
                    $timeout(function () {
                        if(response.data.success){
                        deferred.resolve(response.data[name]);}
                        else{
                            deferred.reject(response.data.error)
                        }
                    }, waitTime - responseTime);
                } else {
                                           if(response.data.success){
                        deferred.resolve(response.data[name]);}
                        else{
                            deferred.reject(response.data.error)
                        }
                }

            }




        }






        /**
                 * @ngdoc method
                 * @name destroy
                 * @methodOf sqd.service:resources
                 * @param {string} name Primary key used for reading the response data from the backend, e.g. 'squidle'
                 * @param {string} api URL of the backend api for the  resource described by 'name', e.g. '/api/v1/squidles'
                 * @param {string} id Used to uniquely identify the requested resource, e.g. '8KLv694'
                *  @param {object=} options {silent:bool} silent false means any exceptions will not be displayed to the user via a popup (defauhlt is true)
                 * @returns {promise} Resolves to an object specific to the backend resource if the resource was updated successfully.  Otherwise the promise is rejected with an object of the form {message:string, code:int}

                 *
                 * @description Destroys a resource on the backend. This takes a minimum time set in the config of resourcesProvider using the method setWaitTime
                 * @example
                 * <pre>resources.destroy('squidle', 'http://squidler.com/api/v1/squidles', '5Ry4fgI')</pre>
                 *
                 *
                 */

                function destroy(name, api, id, options) {

                    var deferred = $q.defer(),
                        startTime = new Date().getTime(),
                        options = options!==undefined ? options : {},
                        silent = options.silent!==undefined ? options.silent : true;


                        $ionicPlatform.ready(function () {

                            try{
                                if ($cordovaNetwork.isOffline()) {

                                    exceptions.create('No internet connection', {toBeRejected:{promise:deferred,message:'No internet connection'},silent:silent})(new Error('No internet connection'));
                                } else {
                                    $http.post(api + "/delete/" + id).then(processResponse).catch(exceptions.create('Cannot destroy ' + name + ' on the server', {toBeRejected:{promise:deferred,message:'resources.destroy fail'},silent:silent}));
                                }
                            }

                            catch(err) {

                                $http.post(api + "/delete/" + id).then(processResponse).catch(exceptions.create('Cannot destroy ' + name + ' on the server',{toBeRejected:{promise:deferred,message:'resources.destroy fail'},silent:silent}));
                            }


                        });



                    return deferred.promise;

                    ////////////////////////////////////////

                    function processResponse(response) {

                        var responseTime = new Date().getTime() - startTime;

                        if (responseTime <= waitTime) {
                            $timeout(function () {
                                if(response.data.success){
                                deferred.resolve(response.data[name]);}
                                else{
                                    deferred.reject(response.data.error)
                                }
                            }, waitTime - responseTime);
                        } else {
                                                   if(response.data.success){
                                deferred.resolve(response.data[name]);}
                                else{
                                    deferred.reject(response.data.error)
                                }
                        }

                    }




                }








                /**
     * @ngdoc method
     * @name action
     * @methodOf sqd.service:resources
     * @param {string} name Primary key used for encoding the  JSON data sent to backend and for reading the response data, e.g. 'squidle'
     * @param {string} action Label for the action you want to perform e.g. "solve"
     * @param {string} id Used to uniquely identify the requested resource that you want to perform the action on, e.g. '8KLv694'
     * @param {string} api URL of the backend api for the  resource described by 'name', e.g. '/api/1/squidles'
     * @param {object} data Data object specific to the backend resource, see http://#/api/backend_resource_list
      * @param {object=} options {formData:bool,silent:bool} formData is when payload is form not just JSON. silent false means any exceptions will not be displayed to the user via a popup (default is true)
     * @returns {promise} Resolves to an object specific to the backend resource if the resource was created successfully.  Otherwise the promise is rejected with an object of the form {message:string, code:int}

     *
     * @description Performs a custom action on the backend, using a POST method. This takes a minimum time set in the config of resourcesProvider using the method setWaitTime
     * @example
     * <pre>resources.action('squidle', 'solve', 'http://squidler.com/api/1/squidles', {...squidle data...})</pre>
     *
     *
     */

    function action(action, name, api, id, data, options) {

        var deferred = $q.defer(),
            startTime = new Date().getTime(),
            namedData = {},
            config = {},
            options = options!==undefined ? options : {},
            silent = options.silent!==undefined ? options.silent : true,
            route =  id ? api + "/" + action +"/" + id : api + "/" + action,
            payload;

                    if(options.formData){
                        config = {transformRequest: angular.identity,headers: {'Content-Type': undefined}};

                        payload = new FormData();
                        payload.append(name, data);
                    }

                    else{
                        namedData[name] = data;
                        payload = data;

                    }



         $ionicPlatform.ready(function () {

             try{
                 if ($cordovaNetwork.isOffline()) {

                     exceptions.create('No internet connection', {toBeRejected:{promise:deferred,message:'No internet connection'},silent:silent})(new Error('No internet connection'));
                 } else {

                     $http.post(route, payload, config).then(processResponse).catch(exceptions.create('Cannot ' + action + " " + name + ' on the server', {toBeRejected:{promise:deferred,message:'resources.action fail'},silent:silent}));
                 }
             }

             catch(err) {



                 $http.post(route, payload, config).then(processResponse).catch(exceptions.create('Cannot ' + action + " " + name + ' on the server', {toBeRejected:{promise:deferred,message:'resources.action fail'},silent:silent}));
             }



         });





/*             $timeout(function () {
                    deferred.resolve(namedData);
                }, waitTime);*/


        return deferred.promise;

        ////////////////////////////////////////

        function processResponse(response) {

            var responseTime = new Date().getTime() - startTime;

            if (responseTime <= waitTime) {
                $timeout(function () {
                    if(response.data.success){
                    deferred.resolve(response.data[name]);}
                    else{
                        deferred.reject(response.data.error)
                    }
                }, waitTime - responseTime);
            } else {
                                       if(response.data.success){
                    deferred.resolve(response.data[name]);}
                    else{
                        deferred.reject(response.data.error)
                    }
            }

        }





    }









    }



    }



})();

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

(function () {
    'use strict';
    angular
        .module('sqd')
        .provider('receipts', receiptsProvider);

    receiptsProvider.$inject = [];

    function receiptsProvider() {

        var api;

        receiptsService.$inject = ['$q', 'resources', 'stores', 'profiles', 'exceptions'];

        var provider = {

            setApi: setApi,
            $get: receiptsService


        };

        return provider;


        ////////////////////////////////////////

        function setApi(url) {

            api = url;

        }





        /**
         * @ngdoc service
         * @name sqd.service:receipts
         * @param {object} $q Angular promise service
         * @param {object} resources Service to communicate with backend resources
         * @param {object} stores Service used to interface with the html5 local storage
          * @param {object} profiles Retrives the public profile for a specific user
         *  @param {object} exceptions Service to catch a failed promise
         * @example
         *
         * @returns {object} Service object exposing methods - read
         *
         * @description
         * This is a service that is returned as part of statisticsProvider. Used to retrieve a statistics information on a particular Squidle
         */

        function receiptsService($q, resources, stores, profiles, exceptions) {

        var service = {

            read: read

        };

        return service;



        ////////////////////////////////////////


            ////////////////////////////////////////


            /**
             * @ngdoc method
             * @name read
             * @methodOf  sqd.service:credits
             * @param {object=} options If it contains the key "refresh" with value true then the credits will be updated from the server
             * @returns {promise} Resolves to an object with keys 'number' telling you the number of credits the current user has
             *
             * @description Retrieves the receipts from previous purchases for the current user
             * @example
             * <pre>receipts.read()</pre>
             *
             */

            function read(options) {

                var deferred = $q.defer(),
                    options = options !== undefined ? options : {},
                    refresh = options.refresh,
                    silent = options.silent !== undefined ? options.silent : false;

                if (refresh) {

                    return getReceipts().catch(exceptions.create('Problem getting your receipts',{silent: silent
                    }));


                }
                else {

                    return stores.read('receipts').catch(getReceipts).catch(exceptions.create('Problem getting your receipts', {silent: silent
                    }));
                }


                ////////////////////////////////////////

                function getReceipts() {

                    return stores.read('auth', 'username').then(function(username){
                        return resources.read('receipts', api, username).then(postProcess);
                    });

                    /////////////////////////////


                    function postProcess(receipts) {

                        var timeStamp;

                        for(var i=0;i<receipts.length;i++){
                            timeStamp = (new Date(receipts[i].date).getTime());
                           stores.create('receipts',timeStamp.toString(),receipts[i],{silent:true});

                        }


                        return $q.when(receipts);


                    }


                }





            }



    }



    }



})();

(function () {
    'use strict';
    angular
        .module('sqd')
        .provider('stores', storesProvider);

    storesProvider.$inject = [];

    function storesProvider() {

        storesService.$inject = ['$q', '$localStorage','exceptions'];

        var provider = {

            $get: storesService


        };

        return provider;


        ////////////////////////////////////////





                        /**
         * @ngdoc service
         * @name sqd.service:stores
         * @param {object} $q Angular promise service
         * @param {object} $localStorage Third party service to access html5 local storage
         * @param {object} exceptions Service to catch a failed promise
         * @returns {object} Service object exposing methods - create, read, update
         *
         * @description
         * This is a service that is returned as part of storesProvider. Used to interface with the html5 local storage
         */

        function storesService($q, $localStorage, exceptions) {

        var service = {

            create: create,
            read: read,
            update: update,
            remove: remove

        };

        return service;



        ////////////////////////////////////////

 /**
         * @ngdoc method
         * @name create
         * @methodOf sqd.service:stores
         * @param {string} name Name of the type of entry you want to save e.g. 'squidles' (Note, this should be plural)
         * @param {string=} id Unique id of the entry to be saved. If not specified then an empty object will be created under "name" if it did not already exist, otherwise nothing is changed.
         * @param {object} data Data object to be saved
         *
         * @returns {promise} Resolves to a string of the form - name + " with id= " + id + " successfully saved to local storage" if the data is stored successfully, otherwise the promise is rejected

         *
         * @description Saves some data in the local storage, but only if it doesnt exist already.  It if does exist nothing is changed, update should be used instead.
         * @example
         * <pre>stores.create('squidles','VJ08tg6', {...squidle data...})</pre>
         *
         *
         */

        function create(name, id, data, options) {


            var deferred = $q.defer(),
                options = options!==undefined ? options : {},
                silent = options.silent!==undefined ? options.silent : false;

            try{

            $localStorage[name] = $localStorage[name] ? $localStorage[name] : {};

                if(id) {

                    var store = $localStorage[name][id];
                    if (store !== null && typeof store === 'object') {
                        angular.forEach(data, function (value, key) {
                            store[key] = store[key] !== undefined ? store[key] : value;
                        });

                    }
                    else if (store === undefined) {
                        $localStorage[name][id] = data;


                    }
                }


         // if(id) {$localStorage[name][id] = $localStorage[name][id] ? $localStorage[name][id] : data;}

            deferred.resolve(name + " with id= " + id + " successfully saved to local storage");}

            catch(error){
                        exceptions.create('Cannot store ' + name + ' with id ' + id, {toBeRejected:{promise:deferred, message:'stores.create error'},silent:silent})(error);
            }
            return deferred.promise;

            ////////////////////////////////////////




        }


             /**
         * @ngdoc method
         * @name read
         * @methodOf sqd.service:stores
         * @param {string} name Name of the type of entry you want to read e.g 'squidles' (Note, this should be plural)
         * @param {string=} id Unique id of the entry to be read. If not specified all entries under "name" will be returned
         *
         * @returns {promise} Resolves to an object specific to the type of data stored if the data is stored successfully, otherwise the promise is rejected
         *
         * @description Reads some data in the local storage
         * @example
         * <pre>stores.read('squidles','VJ08tg6')</pre>
         *
         *
         */


        function read(name, id, options) {

            var deferred = $q.defer(),
                store,
                storeCopy,
                options = options!==undefined ? options : {},
                silent = options.silent!==undefined ? options.silent : false;
                try {
                    store = id ? $localStorage[name][id] : $localStorage[name];
                if (store) {
                    storeCopy = angular.copy(store);
                    deferred.resolve(storeCopy);
                }
                else{
                    throw 'NA'
                }

                }
            catch(error){
                            deferred.reject('Cannot read ' + name + ' with id ' + id + '. Data not in storage');
            }


            return deferred.promise;

            ////////////////////////////////////////




        }

             /**
         * @ngdoc method
         * @name update
         * @methodOf sqd.service:stores
         * @param {string} name Name of the type of entry you want to update e.g. 'squidles' (Note, this should be plural)
         * @param {string} id Unique id of the entry to be updated
         * @param {object} data Object with updated data, note not all original data keys need to be present, only ones that you want to change
         *
         * @returns {promise} Resolves to a string of the form - name + " with id= " + id + " successfully updated" if the data is updated successfully, otherwise the promise is rejected

         *
         * @description Updated some data in the local storage
         * @example
         * <pre>stores.update('squidles','VJ08tg6', {...squidle data...})</pre>
         *
         *
         */


        function update(name, id, data, options) {

           var deferred = $q.defer(),
                 options = options!==undefined ? options : {},
                     silent = options.silent!==undefined ? options.silent : false;

            try {
                var store = $localStorage[name][id];
                if (store !==null && typeof store ==='object') {
               angular.forEach(data, function(value, key){
                    store[key] = value;
               });
               deferred.resolve(store);
           }
           else if (store !==null && store!==undefined) {
                    $localStorage[name][id] = data;
                    deferred.resolve(store);

           }
                else{
                    throw 'NA'
                }

            }
            catch(error){exceptions.create('Cannot update ' + name + ' with id ' + id + '. Data not in storage', {toBeRejected:{promise:deferred, message:'stores.update error'},silent:silent})(error)}




           return deferred.promise;

           ////////////////////////////////////////



       }


                         /**
         * @ngdoc method
         * @name remove
         * @methodOf sqd.service:stores
         * @param {string} name Name of the type of entry you want to remove e.g. 'tempSquidle'
         * @param {string=} id Unique id of the entry to be removed (if not present then all ids will be removed and the store will be reset to {})
         * @param {array=} fields Array of strings that are the keys to be delted. NOTE if not present then the entire data entry will be delted from the local storage
         *
         * @returns {promise} Resolves to a string of the form - 'Entries from ' name  " with id= " id  " successfully deleted from the local storage" if the data is was deleted successfully, otherwise the promise is rejected

         *
         * @description Removes some data in the local storage
         * @example
         * <pre>stores.remove('tempSquidle','prize',['image'])</pre>
         *
         *
         */


        function remove(name, id, fields, options) {


           var deferred = $q.defer(),
               options = options!==undefined ? options : {},
               silent = options.silent!==undefined ? options.silent : false;

            if(name){

            try {
                var store = $localStorage[name];

                if(store && id){
                    store = $localStorage[name][id];
                if (store) {
                    if(fields){
               angular.forEach(fields, function(value, key){
                    delete store[value];
               });

           }
                    else{
                    delete $localStorage[name][id];
                    }
                deferred.resolve('Entries from '+ name + " with id= " + id + " successfully deleted from the local storage");
                }
                    else{
                         throw 'NA'

                    }

            }
                else{
                   $localStorage[name] = {};
                   deferred.resolve();
                }

            }
            catch(error){exceptions.create('Cannot delete entries from ' + name + ' with id ' + id + '. Data not in storage', {toBeRejected:{promise:deferred, message:'stores.destroy error'},silent:silent})(error)}

            }

            else{
                $localStorage.$reset();
                deferred.resolve();

            }






           return deferred.promise;

           ////////////////////////////////////////



       }





    }



    }



})();

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

(function () {
    'use strict';
    angular
        .module('sqd')
        .provider('history', historyProvider);

    historyProvider.$inject = [];

    function historyProvider() {

        var api;

        historyService.$inject = ['$q', 'resources', 'squidles', 'stores', 'exceptions'];

        var provider = {

            setApi: setApi,
            $get: historyService


        };

        return provider;


        ////////////////////////////////////////

        function setApi(url) {

            api = url;

        }





        /**
         * @ngdoc service
         * @name sqd.service:history
         * @param {object} $q Angular promise service
         * @param {object} resources Service to communicate with backend resources
         * @param {object} squidles Service to handle creating/reading/updating Squidles
         * @param {object} stores Service used to interface with the html5 local storage
          * @param {object} exceptions Service to catch a failed promise
         *
         * @returns {object} Service object exposing methods - read
         *
         * @description
         * This is a service that is returned as part of historyProvider. Used to retrieve a history of the Squidles that have either been created or viewed by the user
         */

        function historyService($q, resources, squidles, stores, exceptions) {

        var service = {

            read: read

        };

        return service;



        ////////////////////////////////////////

        /**
         * @ngdoc method
         * @name read
         * @methodOf  sqd.service:history
         * @param {object=} options If it contains the key "refresh" with value true then each entry of the history will be refreshed, otherwise only new squidles will be added
         * @returns {promise} Resolves to an array of squidle objects (see squidles.read for more details on the structure of those objects)
         *
         * @description Retrieves the Squidle history of a user
         * @example
         * <pre>history.read()</pre>
         *
         */

        function read(options) {


            var deferred = $q.defer(),
                options = options!==undefined ? options : {},
                silent = options.silent!==undefined ? options.silent : false,
                tempSquidles;

            if ((options).refresh){

                backupAndClearHistory().then(getUser).then(getHistoryList).then(getAllItems).catch(exceptions.create('Problem getting your Squidles history', {toBeRejected:{promise:deferred,message:'history.read error'},silent:silent}));



            }

            else{
                getUser().then(getHistoryList).then(getAllItems).catch(exceptions.create('Problem getting your Squidles history', {toBeRejected:{promise:deferred,message:'history.read error'},silent:silent}));

            }



            return deferred.promise;

            ////////////////////////////////////////

            function getUser(){
                return stores.read('auth', 'username');
            }

            function backupAndClearHistory(){
                return stores.read('squidles').then(function(squidles){
                  tempSquidles = squidles;
                  return stores.remove('squidles');
                });
            }

            function getHistoryList(username){

                return resources.read('history', api, username).catch(restoreOldSquidles);

            }

            function getAllItems(list){

                var proms = [];


                if(list){



                    for(var i=0;i<list.length;i++){

                        proms.push(squidles.read({short:list[i]},{silent:true}));

                    }



                   return $q.all(proms).then(postProcess,restoreOldSquidles);


                }

                else{
                deferred.resolve();
                return $q.when()
                }

                ////////////////////////////////////////

                function postProcess(squidles){

                    deferred.resolve(squidles);

                    return $q.when(squidles);

                }




            }

            function restoreOldSquidles(error){
                angular.forEach(tempSquidles,function(squidle,short){

                    stores.create('squidles',short,squidle);

                });
                return $q.reject(error);

            }



        }







    }



    }



})();

(function () {
    'use strict';
    angular
        .module('sqd')
        .provider('files', filesProvider);

    filesProvider.$inject = [];

    function filesProvider() {

        var api;
        
         filesService.$inject = ['$q', 'resources', 'exceptions'];

        var provider = {

            setApi: setApi,
            $get: filesService


        };

        return provider;



        ////////////////////////////////////////


        function setApi(url) {

            api = url;

        }


       
        
                /**
         * @ngdoc service
         * @name sqd.service:files
         * @param {object} $q Angular promise service
         * @param {object} resources Service to communicate with backend resources
          * @param {object} exceptions Service to catch a failed promise
         * @returns {object} Service object exposing methods - create
         *
         * @description
         * This is a service that is returned as part of filesProvider. Used to upload image files to the backend
         */

        function filesService($q, resources, exceptions) {

            var service = {

                create: create

            };

            return service;

            ////////////////////////////////////////
            
            
         /**
         * @ngdoc method
         * @name create 
         * @methodOf  sqd.service:files
         * @param {array} files e.g. [{data: dataURI}]
         * @returns {promise} Resolves to an array of objects  -e.g  [{url:'http://squidler.com/api/v1/files/xCvqk8wPnD5KbAlsAwQJ7z.jpeg}] -  if the files was successfully uploaded, otherwise the promise is rejected
         * 
         * @description Takes an array of dataURI objects, turns them into blobs and creates an jpeg file on the backend 
         * @example
         * <pre>files.create([data:'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'])</pre>
         * 
         */

            function create(files,options) {

                var deferred = $q.defer(),
             options = options!==undefined ? options : {},
                 silent = options.silent!==undefined ? options.silent : false;

                processFiles(files).then(uploadFiles).catch(exceptions.create('Problem processing your files', {toBeRejected:{promise:deferred,message:'files.create error'},silent:silent}));



                return deferred.promise;

                ////////////////////////////////////////

                function processFiles(files) {

                    for (var i = 0; i < files.length; i++) {

                        files[i].data = dataURItoBlob(files[i].data);
                    }

                    return $q.when(files);

                    ////////////////////////////////////////

                    function dataURItoBlob(dataURI) {
                        var binary = atob(dataURI.split(',')[1]),
                            array = [];
                        for (var i = 0; i < binary.length; i++) {
                            array.push(binary.charCodeAt(i));
                        }
                        return new Blob([new Uint8Array(array)], {
                            type: 'image/jpeg'
                        });
                    }


                }

                function uploadFiles(files) {

                    var proms = [];


                    for (var i = 0; i < files.length; i++) {

                        proms.push(resources.create('file', api, files[i].data, {formData:true}));
                    }

                    return $q.all(proms).then(postProcess);

                    ////////////////////////////////////////

                    function postProcess(files) {
                        deferred.resolve(files);

                        return $q.when(files);

                    }





                }





            }









        }



    }









})();
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

            function create(data,options) {

                var deferred = $q.defer(),
                    options = options!==undefined ? options : {},
                    silent = options.silent!==undefined ? options.silent : false;

                resources.create('email', api, data).then(postProcess).
                catch(exceptions.create('Problem sending your support email', {toBeRejected:{promise:deferred},silent:silent}));




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
(function () {
        'use strict';
        angular
            .module('sqd')
            .provider('profiles', profilesProvider);

        profilesProvider.$inject = [];

        function profilesProvider() {

            var api;

             profilesService.$inject = ['$q', 'stores', 'resources', 'files', 'exceptions', '$rootScope'];

            var provider = {

                setApi: setApi,
                $get: profilesService


            };

            return provider;


            ////////////////////////////////////////

            function setApi(url) {

                api = url;

            }




            /**
         * @ngdoc service
         * @name sqd.service:profiles
         * @param {object} $q Angular promise service
         * @param {object} stores Service used to interface with the html5 local storage
         * @param {object} resources Service to communicate with backend resources
         * @param {object} files Service to upload images to the backend
          * @param {object} exceptions Service to catch a failed promise
         * @returns {object} Service object exposing methods - read, update
         *
         * @description
         * This is a service that is returned as part of profilesProvider. Used to retrieve and update a user's profile
         */

            function profilesService($q, stores, resources, files, exceptions, $rootScope) {

                var service = {

                    read: read,
                    update: update

                };

                return service;



                ////////////////////////////////////////

        /**
         * @ngdoc method
         * @name read
         * @methodOf  sqd.service:profiles
         * @param {string=} username Username of user. If not present then all locally stored profiles are returned
         * @param {object=} options If presented with the key "refresh" set to true then the requested profile/s will be locally updated from the server data
         * @returns {promise} Resolves to an object with keys: avatar, location, bio and name if profile was successfully read, otherwise the promise is rejected.
         *
         * @description Retrives the public profile for a specific user or all profiles stored locally.
         * @example
         * <pre>profiles.read('joblogs')</pre>
         *
         */

                function read(username,options) {


                     var options = options!==undefined ? options : {},
                         refresh = options.refresh,
                         silent = options.silent!==undefined ? options.silent : false;

                    if(refresh){


                     return  stores.read('profiles',username).then(refreshProfiles).catch(exceptions.create('Problem reading all profiles',{silent:silent}));


                    }
                    else{

                    return stores.read('profiles',username).catch(fetchProfile).catch(exceptions.create('Problem reading profile',{silent:silent}));
                    }


                    ////////////////////////////////////////


                    function fetchProfile(){

                    return resources.read('profile', api, username).then(processResponse);

                        //////////////////////

                        function processResponse(data) {

                        stores.create('profiles', username, data);


                        return $q.when(data);



                    }
                    }

                    function refreshProfiles(data){


                        var usernames = username ? [username] : Object.keys(data),
                            proms = [];

                        if (usernames.length!=0){

                        angular.forEach(usernames, function(username,index){

                            proms.push(resources.read('profile', api, username));

                        });


                   return $q.all(proms).then(postProcess);
                        }

                        else{return $q.when()}

                        ///////////////////////

                        function postProcess(data){

                            var profiles = {};


                            angular.forEach(data, function(profile,index){

                                 stores.update('profiles', usernames[index], profile);
                                profiles[usernames[index]] = profile;

                            });

                            return $q.when(profiles);


                        }


                    }



                    }







                        /**
         * @ngdoc method
         * @name update
         * @methodOf  sqd.service:profiles
         * @param {string} username Username
         * @param {object} profile Data entries that the user wants to update, e.g. bio, avatar, location, etc...
        * @returns {promise} Resolves to an object with keys: avatar, location, bio and name if profile was successfully read, otherwise the promise is rejected.
        *
         * @description Updates the public profile of a speciic user (need to be the user in question to do this)
         * @example
         * <pre>profiles.read('joblogs',{bio:'Me me Me', location:'London'})</pre>
         *
         */


                function update(username,profile,options) {

                    var deferred = $q.defer(),
                        options = options!==undefined ? options : {},
                        silent = options.silent!==undefined ? options.silent : false;

                    processAvatar(profile).then(updateProfile).catch(exceptions.create('Problem updating your profile', {toBeRejected:{promise:deferred},silent:silent}));


                    return deferred.promise;


                    ////////////////////////////////////////


                    function processAvatar(profile) {

                        var hasAvatar = profile.avatar ? true : false;

                        var data = [];

                        if (hasAvatar) {
                            return extractAvatarFromProfile(profile).then(uploadAvatar).then(insertAvatarLinkIntoProfile);
                        } else {
                            return $q.when(profile);
                        }


                        ////////////////////////////////////////

                        function extractAvatarFromProfile(profile) {


                            data.push({
                                data: profile.avatar,
                                label: 'avatar'
                            });


                            return $q.when(data);

                        }

                        function uploadAvatar(data) {

                            return files.create(data);

                        }

                        function insertAvatarLinkIntoProfile(uploaded) {

                            for (var i = 0; i < uploaded.length; i++) {
                                profile[data[i].label]= uploaded[i].url;
                            }

                            return $q.when(profile);


                        }




                    }


                    function updateProfile(profile) {

                        return resources.update('profile', api, username, profile).then(postProcess);

                        ////////////////////////////////////////

                        function postProcess(response) {
                           
                return            stores.update('profiles',username,response).then(function(){
                            deferred.resolve(response); $rootScope.$broadcast('profileUpdated');
                            });

                                            }





                    }






                }



            }
        }



})();

(function () {
    'use strict';
    angular
        .module('sqd')
        .factory('time', time);

    time.$inject = [];

     /**
         * @ngdoc service
         * @name sqd.service:time
         * @returns {object} Service object exposing methods - hourMinSec, remaining
         *
         * @description
         * This is a service used to process time information relating to the squidle expiry the aid in the creation of a countdown
         */



    function time() {


        var service = {

            hourMinSec: hourMinSec,
            remaining: remaining

        };

        return service;




        ////////////////////////////////////////
                        /**
         * @ngdoc method
         * @name hourMinSec
         * @methodOf  sqd.service:time
         * @param {integer} timeSecs Some number of seconds
         * @returns {object} Key "string" gives something of the form 22h 23m 6s. Key array gives something of the form [22,23,6]
         *
         * @description Takes seconds and returns hours mins seconds
         * @example
         * <pre>time.hourMinSec(45632)</pre>
         *
         */

        function hourMinSec(timeSecs) {


         var hours = (timeSecs/60>>0)/60>>0,
             H = hours==0 ? ""  : hours+"h ";

         var mins = (timeSecs/60>>0)%60,
             M = mins ==0 ? ""  : mins+"m " ;

        var secs = (timeSecs||0) % 60,
            S = secs ==0 ? ""  : secs+"s ";

                        return {
                            string: H + M + S,
                            array: [hours,mins,secs]
                        }

        }

                                /**
         * @ngdoc method
         * @name remaining
         * @methodOf  sqd.service:time
         * @param {string} expiresAt Unix time (number of seconds since 1st Jan 1970)
         * @returns {int} Seconds remaining
         *
         * @description Calculates the number of seconds remaining before the squidle expires
         * @example
         * <pre>time.remaining(1470419314)</pre>
         *
         */



        function remaining(unixTimeSec){


            var timeRemaining = unixTimeSec - Math.round(Date.now()/1000);

            return timeRemaining

        }





    }









})();

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

(function() {

    angular
      .module('sqd')
      .directive('noSpaces', noSpaces)

    noSpaces.$inject = [];

    /**
     * @ngdoc directive
     * @name sqd.directive:noSpaces
     * @restrict A
     * @element input
     *
     * @description
     * Use on an input to stop people from being able to type a space
     */


    function noSpaces() {

      var directive = {
        restrict: 'A',
        link: link,
        require: 'ngModel',
      };

      return directive

      ////////////////////////////////////////


      function link(scope, element, attrs, ngModel) {


        ngModel.$parsers.push(function(value) {

        value =  value.replace(/ /g, '');
          ngModel.$setViewValue(value);
       ngModel.$render();

          return value

        });




      }

    }
  }


)();

(function () {

        angular
            .module('sqd')
            .directive('sqdInput', sqdInput)

        sqdInput.$inject = ['$rootScope'];

        /**
         * @ngdoc directive
         * @name sqd.directive:sqdInput
         * @restrict E
         * @scope
         * @param {string} type Same a for html input element
         * @param {string} placeholder Same a for html input element
         * @param {string} name Same a for html input element
         * @param {string} sqdRequired Is the input required
         * @param {int} maxlength Make the input/textarea invalid if its length is greater than this
         * @param {string or object} model Holds the data associated with the input, note this can be just text (use string) and/or media (use object) depending on whether checkForLinks has been selected as an attribute. If set as an object it will have the form {text:[],media:[]}
         * @param {string} ng-readonly Same a for html input element with angularJS
         * @param {bool} valid Is the input valid or not
         * @param {bool} textarea Is the input a textarea
         * @param {object} form Form element that this input belongs to
         * @param {string} colour Class name for the colour of the input
         * @param {string} background Class name for the background colour of the view that the input is inside of
         * @param {bool} links If true the content of the input is checked to see if it contains links, the content of which is then attached to the media key of the model object. Note "model" must be an object not a string for this
         * @param {bool} nospaces If true then the user will be forbidden from typing a space into the input
         * ' @params {bool} checkUsername If true the input will by checked on the  backend to see if it corresponds to an existing username or not
         * * @params {string} enter-submit Prevents "enter" from its doing its default action and instead broadcasts a submit message of the form "submit-{string}"
         *
         * @description
         * Creates an input/textarea with some UI elements to allow the user to e.g. delete all text and also see if input is valid. Also allows the input to be scanned for attachable content from the web. Enter key will prevent default action (shift enter still works for textareas) and broadcasts submit-{name of form}
         */


        function sqdInput($rootScope) {

            var directive = {
                restrict: 'E',
                templateUrl: templateUrl,
                replace: true,
                scope: {
                    type: "@",
                    placeholder: "@",
                    model: "=",
                    ngReadonly: "@",
                    valid: "=",
                    name: "@",
                    form: "=",
                    textarea: "@",
                    colour: "@",
                    background: "@",
                    links: "@",
                    sqdRequired:"@",
                    maxlength:"@",
                    nospaces:"@",
                    checkUsername:"@",
                    enterSubmit:"@"
                },
                link: link,
                controller: "SqdInputController"
            };

            return directive

            ////////////////////////////////////////

            function templateUrl(element, attrs) {

                var url = attrs.textarea ? "app/shared/sqdInput/sqdTextArea.html" : "app/shared/sqdInput/sqdInput.html";

                return url

            }

            function link(scope, element, attrs, ngModelCrtl) {

                //Sync the model with the text, this is needed because we allow the option to have an object or string for the model

                scope.$watch('text', function (val) {
                    if(val!=undefined){
                    if (typeof scope.model === 'object') {
                        scope.model.text = val;
                    } else {
                        scope.model = val;
                    }
                }
                });

                 scope.$watch('model', function (val) {
                      if(val!=undefined){
                    if (typeof scope.model === 'object') {
                        scope.text = val.text;
                    } else {
                        scope.text = val;
                    }
                      }
                }, true);

                if(scope.enterSubmit){
                    element.bind('keydown', function(event) {
                        var code = event.keyCode || event.which;
                        if (code === 13) {
                            if (!event.shiftKey) {
                                event.preventDefault();
                                element.find(scope.textarea ? "textarea" : "input")[0].blur();
                                scope.focus=false;
                                $rootScope.$broadcast('submit-'+scope.enterSubmit);
                            }
                        }
                    });
                }









            }

        }
    }


)();

(function () {

     angular
            .module("sqd")
 .controller("SqdInputController",SqdInputController)

    SqdInputController.$inject = ["$scope"];


    function SqdInputController($scope){


            $scope.clickAction = clickAction;
        $scope.validateForm = validateForm;

        
        activate();

            
            ////////////////////////////////////////
        
        function activate(){
        
            $scope.text = typeof $scope.model === 'object' ? $scope.model.text : $scope.model;
            
        }
            
                        function clickAction(){
          if($scope.focus && $scope.ngReadonly=="false"){
            $scope.text = "";
            if($scope.form){
            $scope.form[$scope.name].$setDirty();
            }
                        }
                
                return;
                
            }
        
        function validateForm(){

             if($scope.form && $scope.text != ""){
            $scope.form[$scope.name].$validate();
            }
            
        }
        




}


})();
(function () {

    angular
        .module('sqd')
        .directive('sqdAvatar', sqdAvatar)

    sqdAvatar.$inject = [];

    /**
     * @ngdoc directive
     * @name sqd.directive:sqdAvatar
     * @restrict E
    * @param {string} src A variable that should contain, or evaluate to a url of a profile image
    * @param {string} letterFrom A variable that hold text from which to create two letters to create a letter avatar
     *
     * @description
     * 
     */

    function sqdAvatar() {

            var directive = {
                restrict: 'E',
                templateUrl: "app/shared/sqdAvatar/sqdAvatar.html",
                replace: true,
                scope: {
                    src: "@",
                    letterFrom: "@",
                },
                link: link,
                controller: "SqdAvatarController"
            };

            return directive

        ////////////////////////////////////////

        function link(scope, element, attrs) {
            
           attrs.$observe('letterFrom', function(val){
                   
                scope.letter = attrs.letterFrom.charAt(0).toUpperCase();
               
               var letterCode = scope.letter.charCodeAt() - 64;

               
              var colourCode = letterCode <=7 ? '#FBAB00' : (letterCode <=14 ? '#FF6B01' : '#FF2A01');
               
               scope.colour = {'background-color':colourCode};
                          
                          });

            
            

                
                 ////////////////////////////////////////
                





        }

    }

})();
(function () {

     angular
            .module("sqd")
 .controller("SqdAvatarController",SqdAvatarController)

    SqdAvatarController.$inject = ["$scope"];


    function SqdAvatarController($scope){



        
        activate();

            
            ////////////////////////////////////////
        
        function activate(){
        
            
            
        }
            

        




}


})();
(function () {

    angular
        .module('sqd')
        .directive('directiveIf', directiveIf)

    directiveIf.$inject = ['$compile'];

    
      /**
         * @ngdoc directive
         * @name sqd.directive:directiveIf
         * @restrict A
         * @param {object} directive-if Any number of directives can be controlled with the object passed in the "directive-if" attribute on this element, e.g. {'myDirective': 'expression'}. If `expression` evaluates to `false` then `attributeName` will be removed from this element, otherwise it will be added
         @description
   * The "directiveIf" directive allows other directives
   * to be dynamically added or removed from this element.
   */
   

    function directiveIf($compile) {
        
        // Error handling.
      var compileGuard = 0;
      // End of error handling.

        var directive = {
             restrict: 'A',
        // Set a high priority so we run before other directives.
        priority: 100,
        // Set terminal to true to stop other directives from running.
        terminal: true,
        compile: compile,
      };
        
         return directive
            
            
            
           //////////////////////////////
        
            function compile() {
                
                var links = {
                    pre: pre,
                    post: post
                };
                
                return links
                
                /////////////////////////////
                
                function pre(scope, element, attr) {


                    // Error handling.
                    // 
                    // Make sure we don't go into an infinite compile loop
                    // if something goes wrong.
                    compileGuard++;
                    if (compileGuard >= 10) {
                        console.log('directiveIf: infinite compile loop!');
                        return;
                    }
                    // End of error handling.


                    // Get the set of directives to apply.
                    var directives = scope.$eval(attr.directiveIf);
                    angular.forEach(directives, function (expr, directive) {
                        // Evaluate each directive expression and remove
                        // the directive attribute if the expression evaluates
                        // to `false`.
                        var result = scope.$eval(expr);
                        if (result === false) {
                            // Set the attribute to `null` to remove the attribute.
                            // 
                            // See: https://docs.angularjs.org/api/ng/type/$compile.directive.Attributes#$set
                            attr.$set(directive, null)
                        }
                        
                        else{
                        attr.$set(directive, true)
                        }
                    });

                    // Remove our own directive before compiling
                    // to avoid infinite compile loops.
                    attr.$set('directiveIf', null);

                    // Recompile the element so the remaining directives
                    // can be invoked.
                    var result = $compile(element)(scope);


                    // Error handling.
                    // 
                    // Reset the compileGuard after compilation
              // (otherwise we can't use this directive multiple times).
              // 
              // It should be safe to reset here because we will
              // only reach this code *after* the `$compile()`
              // call above has returned.
              compileGuard = 0;

                }
                
                function post(scope, element, attr){
                
                }

          
  
        }
            
            
            
            
                   

        
        


        }

        }

    
)();
