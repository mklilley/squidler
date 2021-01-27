(function () {
'use strict';
    angular
            .module('sqd',['ionic','ngCordova','ionic-cache-src', 'ngAnimate', 'templates','menu','welcome','blank','ngStorage','ngMessages', 'camera','ng-walkthrough']);




})();

(function () {
    'use strict';
    angular
        .module('sqd')
        .config(config);



    config.$inject = ['$httpProvider','$stateProvider', '$urlRouterProvider', '$locationProvider', 'squidlesProvider', 'resourcesProvider', 'filesProvider', 'historyProvider', 'emailsProvider','googleImagesProvider', 'usersProvider', 'profilesProvider', 'loginProvider', '$compileProvider', '$sceProvider', '$cacheSrcProvider', 'subscriptionsProvider'];

    function config($httpProvider,$stateProvider, $urlRouterProvider, $locationProvider, squidlesProvider, resourcesProvider, filesProvider, historyProvider, emailsProvider, googleImagesProvider, usersProvider, profilesProvider, loginProvider, $compileProvider, $sceProvider, $cacheSrcProvider, subscriptionsProvider) {

        var base = 'http://old.squidler.com';
        
        
        $urlRouterProvider.otherwise('/blank');
        
        $httpProvider.defaults.withCredentials = true;
        
        $httpProvider.interceptors.push(['$rootScope', '$q', function ($rootScope, $q) {
        return {
            request: function (config) {
                config.timeout = 15000;
                return config;
            }
        }
         }]);
        
        $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    /*config.headers.Authorization = "test";*/
                    if ($localStorage.subscriptions) {
                        //config.headers.token = $localStorage.subscriptions.token;
                        config.headers.Authorization = "test";
                        
                    }
    
                    return config;
                },
                'responseError': function(response) {
                    if(response.status === 401 || response.status === 403) {
                        $location.path('/welcome');
                    }
                    return $q.reject(response);
                }
            };
        }]);


        squidlesProvider.setApi(base + '/api/v1/squidles');

        filesProvider.setApi(base + '/api/v1/files');

        historyProvider.setApi(base + '/api/v1/history');

        resourcesProvider.setWaitTime(1300);

        emailsProvider.setApi(base + '/api/v1/support/question');

        usersProvider.setApi(base + '/api/v1/users');

        profilesProvider.setApi(base + '/api/v1/profiles');

      /*  loginProvider.setApi(base + '/api/v1/users/login');*/
        loginProvider.setApi(base + '/login');

       googleImagesProvider.setApi('https://www.googleapis.com/customsearch/v1');

        googleImagesProvider.setAuthCred(
                    {
                        key: "AIzaSyDuQkoOtI820lE9iKEvzyyGvYfRa-z2MFE",
                        cx:" 004657510724817787166:jk7v1d__46y"
                }
        );
        
                 $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|sms|mailto|twitter|whatsapp|file):/);
        
        subscriptionsProvider.setApi(base+'/api/v1/validate');      
        
        
         $cacheSrcProvider
              .set({color:'#FBAB00'})
         .set({expire:172800});
            



/*          $locationProvider
  .html5Mode(false).hashPrefix("!");*/
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

(function () {
    'use strict';
    angular
        .module('sqd')
        .controller('SqdController', SqdController)

    SqdController.$inject = ['$state', '$scope', 'stores', 'params'];


    function SqdController($state, $scope, stores, params) {

        var self = this;

        self.seenWalkthrough = {};
        self.activeWalkthrough = {};
        self.createText = params.walkthroughs().create;
        self.squidlesText = params.walkthroughs().squidles;


        self.setSeenWalkthrough = setSeenWalkthrough;

        stores.read('usageData', 'walkthroughs').then(function (walkthroughs) {

            self.seenWalkthrough.create = walkthroughs.create ? true : false;

            self.seenWalkthrough.squidles = walkthroughs.squidles ? true : false;
        });

        $scope.$on('showWalkthrough', function (event, label) {

            self.activeWalkthrough[label] = true;


        });


        ////////////////////////////



        function setSeenWalkthrough(label) {
            var walk = {};
            walk[label] = true;
            stores.update('usageData', 'walkthroughs', walk);

            self.seenWalkthrough[label] = true;


            self.activeWalkthrough = {};


        }



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
        
        var items = [{sref:"main.squidles",
         title: "Squidles"},
        {sref: "main.account",
         title: "Profile"},
        {sref: "main.help",
         title: "Help and Support"},
                     {sref: "main.settings",
         title: "Settings"}
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
            
            
                        return {
                squidles:squidles,
                            create:create
            }
            
        }
        
        

        
        
        
        
    }
    
    
    
    
    
    


})();



(function () {
'use strict';
    angular
            .module('create',['ui.router','camera']);




})();
(function () {
    'use strict';
    angular
        .module('create')
        .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {

        $stateProvider
              .state('main.create', {
    url: "/create",
            views:  {
                main: {
                 templateUrl: 'app/components/create/create.html',
          controller: 'CreateController as create',
                }
            }
  });




    }
    
    
    





})();



(function () {
    'use strict';
    angular
        .module('create')
        .controller('CreateController', CreateController)

    CreateController.$inject = ['$rootScope', '$scope', '$ionicModal', '$stateParams', '$ionicLoading', '$state', '$ionicPopup', 'squidles', '$ionicHistory', 'stores', 'links', 'users', 'files', 'params', '$timeout'];


    function CreateController($rootScope, $scope, $ionicModal, $stateParams, $ionicLoading, $state, $ionicPopup, squidles, $ionicHistory, stores, links, users, files, params, $timeout) {

        var self = this;

        self.prizeImg = "";
        self.prize = {};
        self.showImageControls = false;
        self.panelText;
        self.contentHeight = window.innerHeight - 44;
        self.maxPanelHeight = self.contentHeight*0.8;
        self.minPanelHeight = self.contentHeight*0.1;
        self.normalPanelHeight = self.contentHeight*0.33;
        


        self.showCamera = showCamera;
        self.hideCamera = hideCamera;
        self.showSearch = showSearch;
        self.hideSearch = hideSearch;
        self.showFullScreenText = showFullScreenText;
        self.hideFullScreenText = hideFullScreenText;
        self.panelSize = panelSize;
        self.toggleImageControls = toggleImageControls;
        self.next = next;
        self.deleteImage = deleteImage;
        self.canEdit = canEdit;
        self.togglePanel = togglePanel;
        self.previewSquidle = previewSquidle;
        self.calcStyle = calcStyle;


        $scope.$on("processSquide", function () {
            processSquidle();
        });

        $scope.$on('$ionicView.afterEnter', function () {

            if (!self.fullScreenText) {

                activateModals();
            }

        });


        activate();





        ////////////////////////////////////////

        function activate() {
             self.activePanel = "";
            self.squidle = {
                prize: {text:""},
                challenge: {text:""},
                answer: {text:""}
            };

            self.nextText = params.create().nextText;
            self.panelText = params.create().panelText;
            self.placeholderText = params.create().placeholderText;
            




        }

        function activateModals() {

            



            stores.read('tempSquidle').then(function (data) {

                self.squidle = data;

                

                $ionicModal.fromTemplateUrl('app/components/fullScreenText/fullScreenTextModal.html', {
                    id: "fullScreenText",
                    scope: $scope
                }).then(function (modal) {
                    self.fullScreenText = modal;
                });


            });


        }





        function showCamera() {
            
            if (!self.camera) {

                $ionicModal.fromTemplateUrl('app/components/camera/cameraModal.html', {
                    id: "camera",
                    scope: $scope
                }).then(function (modal) {
                    self.camera = modal;
                    self.camera.show();
                });
            }
            
            else{
                
                self.camera.show();
            }
            
            
            
            
        }
        
                      
        function hideCamera(cameraId, img) {

            self.camera.hide();
            if (img) {
                stores.update('tempSquidle', cameraId, {
                    media: img
                });
                self.squidle[cameraId].media = img;
            } 
            
            else if (cameraId) {

                stores.remove('tempSquidle', cameraId, ['media']);
                delete self.squidle[cameraId].media;

            }
        }

        function showSearch() {
            
            if (!self.search) {
            $ionicModal.fromTemplateUrl('app/components/search/searchModal.html', {
                id: "search",
                scope: $scope
            }).then(function (modal) {
                self.search = modal;
                self.search.show();
            });
            }
            else{
                self.search.show();
            }
            
            
        }

        function hideSearch(searchId, img) {
            
            self.search.hide();
            
            if (img) {
                self.squidle[searchId].media = img;
                stores.update('tempSquidle', searchId, {
                  media: img
              });
            }
        }

        function showFullScreenText() {
            self.fullScreenText.show();
        }

        function hideFullScreenText(textId) {
 
            self.fullScreenText.hide();
             stores.update('tempSquidle', textId, {
                  text: self.squidle[textId].text,
                 media:  self.squidle[textId].media
              });
        }




        function panelSize(panelLabel) {

            return self.activePanel != "" ? (self.activePanel == panelLabel ? "80%" : "10%") : "33.33%"

        }

        function toggleImageControls() {

            self.showImageControls = !self.showImageControls
            return

        }

        function togglePanel(panelLabel) {

            self.activePanel = self.activePanel == panelLabel ? "" : panelLabel;
                                
          $timeout(function () {
              $rootScope.$broadcast('showWalkthrough',self.activePanel)
              
                    },300);
                
                  
                           
                

         
        }



        function next(key) {

            switch (key) {
                case "answer":

                    processSquidle();
                    break;

                case "challenge":
                    self.activePanel = "answer";
                    break;
                case "prize":

                    self.activePanel = "challenge";

                    break;
                default:
                    break;

            }




        }

        function processSquidle() {
            
            
            var validPrize = ((self.squidle.prize.text!="") || self.squidle.prize.media) ? true: false;
            
            self.squidleForm.prize.$setValidity("required",validPrize);
            
            
            if (self.squidleForm.$valid) {

                $ionicLoading.show();
                squidles.create(preProcess(self.squidle)).then(function (response) {

                    $ionicLoading.hide();
                    activate();
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $state.go('main.share', {
                        squidleId: response.short
                    });
                });
            } 
            
            else {
                
            var errorText="";
            
            
            angular.forEach(self.squidleForm.$error,function(value,key){
                
                switch(key) {
                        
                    case "required":
                        errorText += "Squidle incomplete - see";
                        angular.forEach(value,function(value,key){
                            errorText += " ";
                            errorText += value.$name;
                            
                            
                        });
                        errorText += ". ";
                        break;
                    case "maxlength":
                          errorText += "Squidle text too long - see";
                        angular.forEach(value,function(value,key){
                                                        errorText += " ";
                            errorText += value.$name;

                            
                        });
                        errorText += ". ";
                        break;
                         default:
                        break; 
                         
                }
                             
                
            });
            
                
                $ionicPopup.alert({
                    title: "Can't lock your Squidle",
                    template: errorText,
                    okType: "button-assertive"
                });
            }


        }

        function preProcess(squidle) {
            var data = {
                prize: {},
                challenge: {},
                answer: {}
            };


            data.answer.text = {
                value: squidle.answer.text
            };

            data.challenge.text = {
                value: squidle.challenge.text
            };

            data.prize.text = {
                value: squidle.prize.text
            };

            if (squidle.challenge.media) {

                if (squidle.challenge.media.type == "image") {
                    data.challenge.photo = {
                        value: squidle.challenge.media.url
                    };
                    data.challenge.photo.uploaded = squidle.challenge.media.from == "device" ? true : false;

                } else if (squidle.challenge.media.type == "video") {
                    data.challenge.video = {
                        value: squidle.challenge.media.url
                    }
                }

            }


            if (squidle.prize.media) {

                if (squidle.prize.media.type == "image") {
                    data.prize.photo = {
                        value: squidle.prize.media.url
                    };
                    data.prize.photo.uploaded = squidle.prize.media.from == "device" ? true : false;

                } else if (squidle.prize.media.type == "video") {
                    data.prize.video = {
                        value: squidle.prize.media.url
                    }
                }

            }




            return data
        }

        function deleteImage(label) {

            delete self.squidle[label].media;
            stores.remove('tempSquidle', label, ['media']);



        }

        function canEdit(label) {

            return self.squidle[label].media.from == 'device' ? true : false


        }


        function previewSquidle() {

            stores.update('preview', 'squidle', preProcess(self.squidle)).then(function (response) {

                $state.go('main.squidle', {
                    squidleId: "preview"
                });

            });
            



        }
        
        
                    function calcStyle(panelLabel){
                        
                var margin;
                
                if(self.activePanel==''){
                    
                margin = (self.normalPanelHeight-75)/2 -20;
                    
                return {'margin-top':margin+'px'}
                    
                    
                }
                else if(self.activePanel!= panelLabel){
                    
                    margin = (self.minPanelHeight-25)/2 -20;
                    
                    return {'margin-top':margin+'px'
                           }
                }
                
            }
        



    }







})();
(function () {
'use strict';
    angular
            .module('menu',['ui.router','squidles','account','help','info','settings']);




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

    MenuController.$inject = ['$scope', '$rootScope','$state', '$ionicLoading', 'stores', 'profiles', 'params', '$ionicPlatform', '$ionicHistory','$localStorage'];


    function MenuController($scope, $rootScope,$state, $ionicLoading, stores, profiles, params, $ionicPlatform, $ionicHistory,$localStorage) {

        var self = this;

        self.items = [];
        self.user = {};

        activate();

        $scope.$on('$ionicView.enter', function () {
            var back = ($ionicHistory.viewHistory().backView || {}).stateName;
            if (['welcome','blank'].indexOf(back) > -1) {

                $ionicHistory.clearHistory();

            }
        });
        
        $scope.$on('profileUpdated', updateProfile);


        ////////////////////

        function activate() {
            
            self.items = params.menu().items;
           
            
            updateProfile();
            
        }
        
        function updateProfile(){
        
                    stores.read('users', 'current').then(readProfile);

            //////////////////////

            function readProfile(username) {
                self.username = username;
                 profiles.read(username).then(function (profile) {
                    self.avatar = profile.avatar;
                     self.first_name = profile.first_name;
                });
            }

        
        
        }
        






        



    }




})();
(function () {
'use strict';
    angular
            .module('account',['ui.router']);




})();
(function () {
    'use strict';
    angular
        .module('account')
        .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {

        $stateProvider
            .state('main.account', {
            url: "/account",
                views: {
                    main: {
                        templateUrl: 'app/components/account/account.html',
                        controller: 'AccountController as account'
      }}

            })



    }
    
    
     angular
        .module('account')
        .constant('$ionicLoadingConfig',{
  templateUrl: "app/components/loading/loading.html",
          delay:300
});


})();

(function () {
    'use strict';
    angular
        .module('account')
        .controller('AccountController', AccountController)

    AccountController.$inject = ['$ionicLoading', '$ionicModal', '$scope', '$ionicPopup', 'profiles', 'stores', '$q', 'params', '$timeout'];


    function AccountController($ionicLoading, $ionicModal, $scope, $ionicPopup, profiles, stores, $q, params, $timeout) {

        var self = this;

        self.loaded = false;

        self.save = save;
        self.hideCamera = hideCamera;
        self.discard = discard;

        $scope.$on('$ionicView.afterEnter', function(){

          $timeout( function() {
          self.tapBlock = false;
          }, 300);

            self.loaded = true;

            if(!self.camera){

                activateCamera();
            }

        });

        $scope.$on('$ionicView.beforeEnter', function () {
self.tapBlock = true;
});


        activate();



        ////////////////////////////////////////

        function activate() {


            $ionicLoading.show();
            stores.read('users', 'current').then(readProfile).then(activateCamera).catch(popupError);


            //////////////////////

            function readProfile(username) {
                self.username = username;
                return profiles.read(username).then(function (profile) {
                    self.profile = profile;
                    $ionicLoading.hide();
                });
            }

            function popupError() {
                $ionicLoading.hide();
                self.alertPopup = $ionicPopup.alert({
                    title: 'Problem loading your profile :-('
                });

            }


        }

 function activateCamera() {

     if (self.loaded){
                return $ionicModal.fromTemplateUrl('app/components/account/avatarModal.html', {
                    id: "camera",
                    scope: $scope
                }).then(function (modal) {
                    self.camera = modal;
                });}
     else{
     return $q.when();
     }

            }


        function save() {
            $ionicLoading.show();
            var data = {};
            angular.forEach(self.profile, function (value, key) {

                if ((self.profileForm[key] || {}).$dirty) {
                    data[key] = value;
                }

            });

            profiles.update(self.username, data).then(function () {
                $ionicLoading.hide();
                 self.profileForm.$setPristine();

            });

        }


        function hideCamera(cameraId, img) {
            var hasChanged;

            self.camera.hide();
            if (img) {
                hasChanged = img.url == self.profile[cameraId] ? false: true;
                self.profile[cameraId] = img.url;
            } else if (cameraId) {
                hasChanged = true;
             self.profile[cameraId] = "";
            }

            if(hasChanged){
                self.profileForm.avatar.$setDirty();
            }
            else{
             self.profileForm.avatar.$setPristine();
            }

        }


        function discard() {
            self.camera.remove();
            activate();
            self.profileForm.$setPristine();

        }


    }




})();

(function () {
'use strict';
    angular
            .module('squidles',['ui.router','create','share','stats']);




})();
(function () {
    'use strict';
    angular
        .module('squidles')
        .config(config);

    config.$inject = ['$stateProvider', '$sceProvider'];

    function config($stateProvider, $sceProvider) {

        $stateProvider
            .state('main.squidles', {
            url: "/squidles",
                views: {
                    main: {
                        templateUrl: 'app/components/squidles/squidles.html',
                        controller: 'SquidlesController as squidles'
      }}

            })
                  .state('main.squidle', {
    url: "/squidles/:squidleId",
    views: {
      main: {
        templateUrl: 'app/components/squidles/squidle.html',
          controller: 'SquidleController as squidle'
      }
    }
  });
        



    }
    
    
    
    
     angular
        .module('squidles')
        .constant('$ionicLoadingConfig',{
  templateUrl: "app/components/loading/loading.html",
          delay:300
});


})();

(function () {
    'use strict';
    angular
        .module('squidles')
        .controller('SquidlesController', SquidlesController)

    SquidlesController.$inject = ['$rootScope','$scope', '$state', '$interval', 'squidles', 'stores', 'time', 'params', 'history', '$ionicPopup','$ionicListDelegate', 'profiles','$timeout'];


    function SquidlesController($rootScope,$scope, $state, $interval, squidles, stores, time, params, history, $ionicPopup,$ionicListDelegate, profiles,$timeout) {

        var self = this;




 $scope.$on('$ionicView.beforeEnter', function() {
  activate();
});
         $scope.$on('$ionicView.beforeLeave', function() {

            self.hideAllOptions();
});




   $scope.$on('$destroy', function() {

         if(self.timer){
$interval.cancel(self.timer);}
        });


        self.goToSquidle = goToSquidle;
        self.shareSquidle = shareSquidle;
        self.countDown = countDown;
        self.startTimer = startTimer;
        self.createSquidle = createSquidle;
        self.refresh = refresh;
        self.deleteSquidle = deleteSquidle;
        self.hideAllOptions = hideAllOptions;
        self.statsOnSquidle = statsOnSquidle;


        ////////////////////////////////////////

        function activate() {

            self.list = self.list ? self.list : [];
            self.listIds = self.listIds ? self.listIds : {};
            self.defaultAvatar = params.squidles().defaultAvatar;
            self.firstTime = false;


            stores.read('usageData','walkthroughs').then(function(walkthroughs){


                          $timeout(function () {

     $rootScope.$broadcast('showWalkthrough','squidles')

                    },1000);


                });

            stores.read('profiles').then(readSquidles);


            ////////////////////

            function readSquidles(profileData){

                squidles.read().then(function (data) {

                angular.forEach(data, function (value, key) {
                    var s = {};
                    s.username = value.op;
                    s.description = value.challenge.text.value;
                    s.id = value.short;
                    s.avatar = profileData[value.op].avatar;
                    s.first_name = profileData[value.op].first_name;
                    s.sent = value.sent;
                    s.hasAttachment = 'video' in value.challenge || 'photo' in value.challenge;
                    s.alreadyAnswered = 'prize' in value;
                    s.timeRemaining = time.remaining(value.expires_at);


                    if (s.timeRemaining <= 0) {

                    stores.remove('squidles', s.id);

                    removeSquidleFromList(s.id);



                    }

                    else{

                      if(self.listIds[s.id]==undefined){
                        self.list.push(s);
                        self.listIds[s.id] = self.list.length-1;
                      }
                        else{
                        //  self.list[self.listIds[s.id]] = s;
                        }
                    }



                });


                if(self.list.length==0){
                    stores.read('usageData','opens').then(function(opens){

                        self.firstTime = opens.number==1 ? true : false;
                });

                }

                self.startTimer();
            });


            }





        }

        function createSquidle () {
            $state.go('main.create');
        }

        function goToSquidle(short) {

            $state.go('main.squidle', {
                squidleId: short
            });

        }

        function shareSquidle(short) {


            $state.go('main.share', {
                squidleId: short
            });

        }

        function deleteSquidle(squidle){

            var short = squidle.id,
                text = squidle.sent ? 'You are about to delete your Squidle everywhere across the world.' : 'You are about to delete this Squidle from your phone.'


        var confirmPopup = $ionicPopup.confirm({
     title: 'Delete Squidle',
     template: text,
    okType: "button-energized"
   });
   confirmPopup.then(function(res) {
     if(res) {

       squidles.remove(squidle).then(function(){

         removeSquidleFromList(short);

       });
     } else {

     }
   });


        }



        function countDown(timeRemaining) {

            return time.hourMinSec(timeRemaining).string


        }



        function startTimer() {

            self.timer = self.timer ? self.timer : $interval(function () {

                angular.forEach(self.list, function (value, key) {

                    value.timeRemaining -= 1;

                    if (value.timeRemaining <= 0) {

                        removeSquidleFromList(value.id);

                        stores.remove('squidles', value.id);

                    }

                });





            }, 1000);

        }

        function refresh(){

            var options = {refreshAll:true};

            history.read(options).then(function(){
              self.list = [];
              self.listIds = {};
             activate();
                 $scope.$broadcast('scroll.refreshComplete');
            }).catch(function(){
                $scope.$broadcast('scroll.refreshComplete');

            });

        }



        function hideAllOptions(){
            $ionicListDelegate.closeOptionButtons();
            $scope.$broadcast('closeOptions');
        }

        function statsOnSquidle(short){

            $state.go('main.stats', {
                squidleId: short
            });


        }

        function removeSquidleFromList(short){

          if(self.listIds[short]!=undefined){
          self.list.splice(self.listIds[short],1);
          self.listIds={};

          angular.forEach(self.list,function(value,key){
            self.listIds[value.id]=key;
          });
        }

        }






    }






})();

(function () {
'use strict';
    angular
            .module('stats',['ui.router']);




})();
(function () {
    'use strict';
    angular
        .module('stats')
        .config(config);

    config.$inject = ['$stateProvider', '$sceProvider', '$compileProvider'];

    function config($stateProvider, $sceProvider, $compileProvider) {

        $stateProvider
                          .state('main.stats', {
    url: "/stats/:squidleId",
                views: {
                    main: {
                        templateUrl: 'app/components/stats/stats.html',
                        controller: 'StatsController as stats'
                    }
                }
            });
        
                 $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|sms|mailto|twitter|whatsapp|file):/);


    }
    
    
    


})();

(function () {
'use strict';
    angular
            .module('stats')
            .controller('StatsController',StatsController)

    StatsController.$inject = ['$scope','$state','$stateParams','$ionicPopup','$ionicPlatform','$ionicLoading','squidles', '$interval','statistics','profiles','$cordovaNetwork'];


    function StatsController($scope,$state,$stateParams,$ionicPopup,$ionicPlatform,$ionicLoading,squidles,$interval,statistics,profiles,$cordovaNetwork){
        
        var self = this;
        
        self.short = $stateParams.squidleId;
        self.players = [];
        self.canRefresh = true;
        
        self.refresh = refresh;
        

        
        activate();
        
           $scope.$on('$destroy', function() {
         
         if(self.interval){
$interval.cancel(self.interval);}
        });
        

        
        
        
        ////////////////////////////////////////
        
        function activate(){
            
            
            squidles.read({short:self.short}).then(processStats);
            
            self.refresh();
            
        
            self.interval = self.interval ? self.interval :  $interval(refresh,10000);
                


        }
        

        
        
        
        function refresh() {

            try {
                $ionicPlatform.ready(function () {

                    if ($cordovaNetwork.isOnline()) {
                        doRefresh();
                        self.canRefresh = true;

                    }
                    else{
                        self.canRefresh = false;
                    }

                });
            } catch (err) {
                doRefresh();

            }



            ////////////////

            function doRefresh() {

                $ionicLoading.show();

                statistics.read(self.short).then(function (squidle) {

                    processStats(squidle);
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');

                }).catch(function () {
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');

                });

            }


        }
        
         function processStats(squidle){
             
             profiles.read().then(function(profileData){
                 
              self.players = squidle.stats.players;
             self.summary = squidle.stats.summary;
             
             angular.forEach(self.players, function(player,index){
   
                 self.players[index].avatar = profileData[player.username].avatar;
                 self.players[index].first_name = profileData[player.username].first_name;
                 
             });
                 
                 
             });
 

                
            
          
        
        }
        
        
            
            

            
            
        }
        
            
        
    
        


        
        

 


    




})();
(function () {
'use strict';
    angular
            .module('squidles')
            .controller('SquidleController',SquidleController)

    SquidleController.$inject = ['$scope', '$rootScope', '$state', 'squidles', 'stores', '$stateParams','$ionicLoading', '$ionicSlideBoxDelegate', '$ionicModal', '$ionicPopup', '$ionicHistory', 'time', '$interval', '$timeout', '$ionicPlatform', '$cordovaClipboard','$ionicScrollDelegate'];


    function SquidleController($scope, $rootScope, $state, squidles, stores, $stateParams, $ionicLoading, $ionicSlideBoxDelegate, $ionicModal, $ionicPopup, $ionicHistory, time, $interval, $timeout, $ionicPlatform, $cordovaClipboard,$ionicScrollDelegate){

        var self = this;

        self.data = {};
        self.guess = "";

        self.alreadyAnswered = false;
        self.prizeDisplayed = false;
        self.validGuess = true;
        self.adjustForIos = ionic.Platform.isIOS() ? {top:'20px'}:{top:'20px'};

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


     $scope.$on('$destroy', function() {

         if(self.timer){
$interval.cancel(self.timer);}
        });

  $ionicModal.fromTemplateUrl('app/components/squidles/fullscreenModal.html', {
    scope: $scope
  }).then(function(modal) {
    self.fullscreen = modal;
  });

          self.openFullscreen = function() {
   self.fullscreen.show();
  };


 self.closeFullscreen = function() {
   self.fullscreen.hide().then(function(){

       self.resetFullScreenImage();


   });

  };

  //Cleanup the popover when we're done with it!
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
                   self.answerHeight = calcAnswerHeight();

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

                var timeRemaining = time.remaining(squidle.expires_at);

                if(timeRemaining<=0){

                    squidleExpired();

                }

                else{

                     self.data = angular.copy(squidle);

                     self.answerHeight = calcAnswerHeight(self.data.answer.text.hint);

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
                         $state.go('main.squidles');
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
            squidles.read(guessData).then(postProcess).catch(showError)

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

            function showError(){

                $ionicLoading.hide();

                 $ionicPopup.alert({
     title: "Something went wrong, sorry"
   });


            }


        }

        function createSquidle(){

        $state.go('main.create');

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
                         $state.go('main.squidles');
                         });

                          $timeout(function() {
     self.outOfTime.close();
     $ionicHistory.nextViewOptions({
  historyRoot: true
});
                         $state.go('main.squidles');
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

                var numLines = (text.length / 15 >> 0) + 1;
                var ems = Math.max(numLines*1.25, 2.5);

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
            .module('squidles')

.directive('holdForOptionsWrapper', [function() {
	return {
		restrict: 'A',
		controller: ['$scope',function($scope) {
			this.closeOptions = function() {
				$scope.$broadcast('closeOptions');
			}
		}]
	};
}]);



})();
(function () {
'use strict';
    angular
            .module('squidles')

.directive('holdForOptions', ['$ionicGesture', function($ionicGesture) {
	return {
		restrict: 'A',
		scope: false,
		require: '^holdForOptionsWrapper',
		link: function (scope, element, attrs, parentController) {
			// A basic variable that determines wether the element was currently clicked
			var clicked;

			// Set an initial attribute for the show state
			attrs.$set('optionButtons', 'hidden');

			// Grab the content
			var content = element[0].querySelector('.item-content');

			// Grab the buttons and their width
			var buttons = element[0].querySelector('.item-options');			

			var closeAll = function() {
				element.parent()[0].$set('optionButtons', 'hidden');
			};

			// Add a listener for the broadcast event from the parent directive to close
			var previouslyOpenedElement;
			scope.$on('closeOptions', function() {
                var content = element[0].querySelector('.item-content')
				if (!clicked && content.$$ionicOptionsOpen) {
					//attrs.$set('optionButtons', 'hidden');
                    content.$$ionicOptionsOpen = false;
                   hideOptions();
				}
			});

			// Function to show the options
			var showOptions = function() {
				// close all potentially opened items first
				parentController.closeOptions();

				var buttonsWidth = buttons.offsetWidth;
				ionic.requestAnimationFrame(function() {
					// Add the transition settings to the content
					content.style[ionic.CSS.TRANSITION] = 'all ease-out .25s';

					// Make the buttons visible and animate the content to the left
					buttons.classList.remove('invisible');
					content.style[ionic.CSS.TRANSFORM] = 'translate3d(-' + buttonsWidth + 'px, 0, 0)';

					// Remove the transition settings from the content
					// And set the "clicked" variable to false
					setTimeout(function() {
						content.style[ionic.CSS.TRANSITION] = '';
						clicked = false;
					}, 250);
				});		
			};

			// Function to hide the options
			var hideOptions = function() {
				var buttonsWidth = buttons.offsetWidth;
				ionic.requestAnimationFrame(function() {
					// Add the transition settings to the content
					content.style[ionic.CSS.TRANSITION] = 'all ease-out .25s';

					// Move the content back to the original position
					content.style[ionic.CSS.TRANSFORM] = '';
					
					// Make the buttons invisible again
					// And remove the transition settings from the content
					setTimeout(function() {
						buttons.classList.add('invisible');
						content.style[ionic.CSS.TRANSITION] = '';
					}, 250);				
				});
			};

			// Watch the open attribute for changes and call the corresponding function
			attrs.$observe('optionButtons', function(value){
				if (value == 'show') {
					showOptions();
				} else {
					hideOptions();
				}
			});

			// Change the open attribute on tap
			$ionicGesture.on('hold', function(e){
				clicked = true;
                var content = element[0].querySelector('.item-content');
                
				//if (attrs.optionButtons == 'show') {
				if (content.$$ionicOptionsOpen) {
                  
                    content.$$ionicOptionsOpen = false;
                    parentController.closeOptions();
                    hideOptions();
					//attrs.$set('optionButtons', 'hidden');
				} else {
                    
                    content.$$ionicOptionsOpen = true;
                    showOptions();
					//attrs.$set('optionButtons', 'show');
				}

			}, element);
		}
	};
}]);



})();
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

    InfoController.$inject = [];


    function InfoController(){


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
            url: "/help",
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

    HelpController.$inject = ['$scope', '$ionicModal', '$ionicLoading', '$ionicPopup', 'emails'];


    function HelpController($scope, $ionicModal, $ionicLoading, $ionicPopup, emails){
        
        var self = this;
        
        self.question = {
        name:"",
            email:"",
            message:""
        };
        
        self.FAQs = [
            {
                question:" After I have locked my Squidle I get a URL, what is it for?",
                answer:"This is used to share your Squidle with your friends, click on this URL and it will take you to your Squidle"
            },
          {
                question:"I have created a Squidle but how do i send it to a friend?",
                answer:"Squidler allows you to send a Squidle via your favourite messaging platform.  Just copy and paste the Squidle link into your preferred app, e.g. email, whatsapp, sms and off you go"
            },

            {  question:" Can I share a Squidle with lots of people?",
                answer:"Absolutely! Just copy and paste the Squidle link into your preferred app, e.g. Twitter, reddit"
            },
                      {
                question:"Who can see my Squidle?",
                answer:"A Squidle is something anyone can see if they have the Squidle link, but only those who can solve it can get the prize."
            },
                                  {
                question:"Can I attach things other than images, animations and YouTube videos?",
                answer:"Not right now, but we are working really hard to add more functionality"
            },
            {
                question:"What kind of links can I use to attach an image or animation?",
                answer:"Any links ending in .jpg, .png, .jpeg, .gif or .gifv will work.  You can also use links to imgur e.g. imgur.com/gallery/H5Xw4dh"
            },
            {question:"Can I change the lifetime of my Squidle?",
            answer:"Yes you can - go to the share screen to change this. The defult is 21 hours, but can be as short as 5 mins and as long as 85 hours."},
            {question:"Can I make my Squidle harder?",
                answer:"Yes you can - go to the share screen and turn off hangman mode to remove the placeholders for the answer. "},
                        {question:"Can I delete a Squidle?",
                answer:"Yes - swipe or tap and hold on a Squidle to show the delte button. Deleting a Squidle that you own deltes it from our servers so people can no longer attempt your Squidle. If you don't own the Squidle then deleting simply removes it from your phone and removes all records of you viewing it from our servers."}



        ];
        
        self.toggleFAQ = toggleFAQ;
        self.isFAQShown = isFAQShown;
        self.submitQuestion = submitQuestion
        
        activate();
        
        
        
        ////////////////////////////////////////
        
        function activate(){
                          
        $ionicModal.fromTemplateUrl('app/components/help/askQuestionModal.html', {
            scope: $scope
        }).then(function (modal) {
            self.askQuestion = modal;
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
                self.askQuestion.remove();
                activate();
            });
                
            }
            
            else{
             $ionicPopup.alert({
     title: "Incomplete help form",
                 okType: "button-assertive"
   });
            }
            
        
        }


    }




})();
(function () {
'use strict';
    angular
            .module('settings',['ui.router']);




})();
(function () {
    'use strict';
    angular
        .module('settings')
        .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {

        $stateProvider
            .state('main.settings', {
                url: "/settings",
                views: {
                    main: {
                        templateUrl: 'app/components/settings/settings.html',
                        controller: 'SettingsController as settings'
                    }
                }

            });


    }
    
     angular
        .module('settings')
        .constant('$ionicLoadingConfig',{
  templateUrl: "app/components/loading/loading.html",
          delay:300
});


})();
(function () {
    'use strict';
    angular
        .module('settings')
        .controller('SettingsController', SettingsController)

    SettingsController.$inject = ['$scope', '$rootScope','$state', '$ionicLoading', 'stores'];


    function SettingsController($scope, $rootScope, $state, $ionicLoading, stores) {

        var self = this;

        self.logout = logout;



        ////////////////////

        
        function logout(){
            
           stores.remove().then(function(){

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
        stores.create('usageData','timeLastOpen',{}).then(function(){
            
                     $rootScope.alreadyOpen = false;
$rootScope.$broadcast('reset');
        });

               
           });
            


            
    
            
            
            

            
      
            
            
            
        }
        
    
        






        



    }




})();
(function () {
'use strict';
    angular
            .module('share',['ui.router']);




})();
(function () {
    'use strict';
    angular
        .module('share')
        .config(config);

    config.$inject = ['$stateProvider', '$sceProvider', '$compileProvider'];

    function config($stateProvider, $sceProvider, $compileProvider) {

        $stateProvider
                          .state('main.share', {
    url: "/share/:squidleId",
                views: {
                    main: {
                        templateUrl: 'app/components/share/share.html',
                        controller: 'ShareController as share'
                    }
                },
            resolve: {
                canModify: canModify
                }
            });
        
                 $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|sms|mailto|twitter|whatsapp|file):/);


    }
    
    canModify.$inject = ['squidles', '$stateParams', '$q'];

    function canModify(squidles, $stateParams, $q) {
        return squidles.read({
            short: $stateParams.squidleId
        }).then(function (data) {
            
            if(data.sent){
                
                return $q.resolve(data.sent);
               //return resources.read('squidles','http://old.squidler.com/api/v1/squidles/canmodify',$stateParams.squidleId)
            }
            
            else{
                return $q.resolve(data.sent);
            }
            

            

        });
    }
    



})();

(function () {
'use strict';
    angular
            .module('share')
            .controller('ShareController',ShareController)

    ShareController.$inject = ['$state','$stateParams','$ionicPopup','$ionicPlatform','$ionicLoading','$cordovaClipboard', '$cordovaSocialSharing','squidles','time','canModify'];


    function ShareController($state,$stateParams,$ionicPopup,$ionicPlatform,$ionicLoading,$cordovaClipboard, $cordovaSocialSharing,squidles,time,canModify){

        
        var self = this;
        
        self.short = $stateParams.squidleId;
        self.url = "https://dev.squidler.com/#!/"+self.short;
        self.isIOS = ionic.Platform.isIOS();
        self.smsLink = self.isIOS ? "sms:12345678&body="+self.url : "sms:?body="+self.url;
        self.allowed = {};
        self.canModify = canModify;
        
        self.copyShortLink = copyShortLink;
        self.goToSquidle = goToSquidle;
        self.updateExpiry = updateExpiry;
        self.updateHint = updateHint;
        self.expiryChanged = expiryChanged;
        self.viaFacebook = viaFacebook;
        self.viaTwitter = viaTwitter;
        self.viaEmail = viaEmail;
        self.viaSMS = viaSMS;
        self.viaWhatsapp = viaWhatsapp;
        self.viaOther = viaOther;
        self.computeExpiry = computeExpiry;
        
        activate();
        

        
        
        
        ////////////////////////////////////////
        
        function activate(){
            
            

            squidles.read({short:self.short}).then(function(data){
            
                self.squidle = data;
                self.hint = data.answer.text.hint.length>0 ? true : false;
                self.ownSquidle = data.sent;
                
                
                self.hourMinSec = time.hourMinSec(time.remaining(data.expires_at));
                
                self.hours=self.hourMinSec.array[0];
                self.mins=self.hourMinSec.array[1];
                              
                
            });
            try {
            canShareVia('facebook');
            canShareVia('whatsapp');
            canShareVia('twitter');}
            catch(err){}
            
/*           try {self.allowed.facebook = 
            self.allowed.whatsapp = canShareVia('whatsapp');
            self.allowed.twitter = }
            catch(err) {}
        */
            
            
        }
        
            
        
        function copyShortLink(){
            
          try{  $ionicPlatform.ready(function() {
                
  $cordovaClipboard
    .copy(self.url)
    .then(function () {
                        self.alertPopup = $ionicPopup.alert({
     title: 'Squidle link copied :-)',
                            okType: "button-assertive"
   });
    }, function () {
                       self.alertPopup = $ionicPopup.alert({
     title: 'Failed to copy Squidle link :-(',
                           okType: "button-assertive"
   });
    });
                
}); }
            catch(err){
             self.alertPopup = $ionicPopup.alert({
     title: 'Failed to copy Squidle link :-(',
                 okType: "button-assertive"
   });
            }


        }
        
        function goToSquidle(){
            
            $state.go('main.squidle', { squidleId: self.short });
        
        }
        
        function updateExpiry(){
            
            computeExpiry();
            
            $ionicLoading.show();
            
            var squidle = {
                short: self.squidle.short,
                expires_at: {
                    interval:'minute',
                    units:self.expiry
                }
            };
            

        squidles.update(squidle,'expiry').then(function(){
        $ionicLoading.hide();
            activate();
        });
   
        }
        
        function updateHint(){
            
             $ionicLoading.show();
            
            var squidle = {
                short: self.squidle.short,
                answer: self.squidle.answer,
                hintOn: self.hint
            }
            
            self.squidle.hintOn = self.hint;    
             
              squidles.update(squidle,'hint').then(function(){
        $ionicLoading.hide();
        }).catch(function(){
              
              self.hint = !self.hint;
              });

        }
        
        function expiryChanged(){
        
            return (self.hourMinSec.array[0] != self.hours) || (self.hourMinSec.array[1] != self.mins);
        
        }
        
        function viaTwitter(){
        
        $ionicPlatform.ready(function() {
              $cordovaSocialSharing
    .shareViaTwitter(null, null, self.url)
    .then(function(result) {
      // Success!
    }, function(err) {
      // An error occurred. Show a message to the user
    });
                });
        
            
        }
        
        function viaFacebook(){
             $ionicPlatform.ready(function() {
                  $cordovaSocialSharing
    .shareViaFacebook(null, null, self.url)
    .then(function(result) {
      // Success!
    }, function(err) {
      // An error occurred. Show a message to the user
    });
             });
        }
        
        function viaWhatsapp(){
             $ionicPlatform.ready(function() {
                  $cordovaSocialSharing
    .shareViaWhatsApp(null, null, self.url)
    .then(function(result) {
      // Success!
    }, function(err) {
      // An error occurred. Show a message to the user
    });
             });
        }
        
        function viaEmail(){
             $ionicPlatform.ready(function() {
               $cordovaSocialSharing
    .shareViaEmail(self.url, null, null, null, null, null)
    .then(function(result) {
      // Success!
    }, function(err) {
      // An error occurred. Show a message to the user
    });
             });
        }
        
        function viaSMS(){
             $ionicPlatform.ready(function() {
               $cordovaSocialSharing
    .shareViaSMS(self.url, "")
    .then(function(result) {
      // Success!
    }, function(err) {
      // An error occurred. Show a message to the user
    });
             });
        }
        
        function viaOther(){
             $ionicPlatform.ready(function() {
                  $cordovaSocialSharing
    .share(null, null, null, self.url) // Share via native share sheet
    .then(function(result) {
      // Success!
    }, function(err) {
      // An error occured. Show a message to the user
    });
             });
        }
        
        function canShareVia(socialType){
            
self.allowed[socialType] = true;
            
             $ionicPlatform.ready(function() {
             
               $cordovaSocialSharing
    .canShareVia(socialType, null, null, null, self.url)
    .then(function(result) {
                self.allowed[socialType] = true;
    }, function(err) {
self.allowed[socialType] = false;
    });
             });
            
           
        
        }
        
        function computeExpiry(){
            
            self.expiry = self.hours*60 + self.mins;
        
            

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

    WelcomeController.$inject = ['$scope', '$rootScope', '$state', '$ionicSlideBoxDelegate', '$ionicModal', '$timeout','$ionicHistory', '$ionicPopup', 'login', 'history', '$ionicLoading', 'params','stores','subscriptions','squidles'];


    function WelcomeController($scope, $rootScope, $state, $ionicSlideBoxDelegate, $ionicModal, $timeout,$ionicHistory, $ionicPopup,login, history, $ionicLoading, params,stores,subscriptions,squidles) {

        var self = this;

        self.slideIndex = 0;
        self.debugMode = false;
        self.debugMessages = [];
        self.api = "https://dev.squidler.com/api/v1/subscriptions";
        self.productId = "create_squidle_01";

        self.next = next;
        self.previous = previous;
        self.slideChanged = slideChanged;
        self.letsGo = letsGo;
        self.closeSignup = closeSignup;
        self.doSignup = doSignup;
        self.changeLogo = changeLogo;
        self.finishLogin = finishLogin;
        self.testBuy = testBuy;
        self.testRestore = testRestore;
        self.testVerify = testVerify;

        
        $scope.$on('iap',function(event,data){
            
            
            self.debugMessages.push(data);
            
        });
        
        


        activate();


        ////////////////////

        function activate(){
            
            self.logos = params.welcome().logos;
            
            var numLogos = self.logos.length; 
            
            self.logoIndex = Math.random()/(1.0/parseFloat(numLogos))>>0;
            
            self.logo = self.logos[self.logoIndex];
                // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('app/components/welcome/signupModal.html', {
            id: "signup",
            scope: $scope
        }).then(function (modal) {
            self.modal = modal;
        });
        }

        function next() {
            $ionicSlideBoxDelegate.next();
        };

        function previous() {
            $ionicSlideBoxDelegate.previous();
        };

        function slideChanged(index) {
            self.slideIndex = index;
        };

        // Open the login modal
        function letsGo() {
            self.modal.show();
        };

        // Triggered in the login modal to close it
        function closeSignup() {
            self.modal.hide();
        };
        
        
        
                function doSignup(){
                    
                    
                 
            
             if(self.signupForm.$valid){
                
                 $ionicLoading.show();
                 subscriptions.create({loginDetails:{username:self.username, password:self.password}}).then(function(){
                     
                     
                    return squidles.read({short:'welcome'});
                     
                   
                     
                 }).then(function(){
                     stores.update('usageData','opens',{number:1});
                     
                     $rootScope.alreadyOpen = true;
                        $ionicLoading.hide();
                     self.finishLogin();
                     
                 });
                 
                 
             }
            
            else{
                         $ionicPopup.alert({
     title: "Signup form incomplete",
                             okType: "button-assertive"
   });
            }
        
        }



        function finishLogin(){
            self.closeSignup();
            $state.go('main.squidles');
            
        }
        
        
        function changeLogo(){
           
            var numLogos = self.logos.length; 
            
            self.logoIndex  = (self.logoIndex + 1)%numLogos;
            
            self.logo = self.logos[self.logoIndex];
            
            //self.debugMode = true;
            
            
           // subscriptions.create();
        
        }
        
        function testBuy(){
            
            subscriptions.create({productId:self.productId});
            
        }
        
        
        function testRestore(){
            
            subscriptions.read({subscriptions:true,productId:self.productId});
            
        }
        
        function testVerify(){
            
             subscriptions.verify({api:self.api});
            
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
            .module('login',['ui.router']);




})();
(function () {
    'use strict';
    angular
        .module('login')
        .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {

        $stateProvider
            .state('login', {
                url: 'login/',
                views: {
                    'main': {
                        templateUrl: 'app/components/login/login.html',
                        controller: 'LoginController as login'
                    }
                },
                sticky: true
            });


    }
    
    
     angular
        .module('login')
        .constant('$ionicLoadingConfig',{
  templateUrl: "app/components/loading/loading.html",
          delay:300
});


})();
(function () {
'use strict';
    angular
            .module('login')
            .controller('LoginController',LoginController)

    LoginController.$inject = ['$state','users'];


    function LoginController($state,users){
        var login= this;

        login.loginUser = loginUser;


        ////////////////////

        function loginUser() {
          users.login().then(loginSuccess).catch(loginFailed);


            function loginSuccess(response) {
                 $state.go('create');
            }

            function loginFailed(error) {
                console.log('something went wrong, please try again');
            }

            }


        }









})();
(function () {
'use strict';
    angular
            .module('signup',['ui.router']);




})();
(function () {
    'use strict';
    angular
        .module('signup')
        .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {

        $stateProvider
            .state('signup', {
                url: '/signup',
                views: {
                    'main': {
                        templateUrl: 'app/components/signup/signup.html',
                        controller: 'SignupController as signup'
                    }
                },
                sticky: true
            });


    }
    
    
    
     angular
        .module('signup')
        .constant('$ionicLoadingConfig',{
  templateUrl: "app/components/loading/loading.html",
          delay:300
});


})();
(function () {
'use strict';
    angular
            .module('signup')
            .controller('SignupController',SignupController)

    SignupController.$inject = ['$scope', '$ionicPopup', 'login'];


    function SignupController($scope, $ionicPopup, login){
        
        var self = this;
        
        
        self.doSignup = doSignup;
        
        
        /////////////////////////
        
        function doSignup(){
            
             if(self.signupForm.$valid){

             login({username:self.username, password:self.password}).then(
            function(){ 
            history.read().then(function(){
            $scope.finishLogin();
            
            });
            }
            );
                 
             }
            
            else{
                         $ionicPopup.alert({
     title: "Signup form incomplete"
   });
            }
        
        }


    }




})();
(function () {
'use strict';
    angular
            .module('camera',['ui.router', 'Kinetic', 'EXIF']);




})();
(function () {
    'use strict';
    angular
        .module('camera')
        .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {

        $stateProvider
              .state('camera', {
    url: "/camera",
            views:  {
                app: {
                 templateUrl: 'app/components/camera/cameraModal.html'
                }
            }
  });




    }
    
    




})();



(function () {

    angular
        .module('camera')
        .directive('camera', camera)

    camera.$inject = [];
    
           /**
         * @ngdoc directive
         * @name camera.directive:camera
         * @restrict E
         * @scope 
         * @param {string} id Unique id for this camera element
         * @param {string} image datURI representing a saved image
         * @param {function} close a function to be called from the parent scope that allows the camera modal to be closed.
         * @param {bool} active A boolean to determine if this camera is currently active
         * @description
         * Creates an interfae to take photos and edit them
         */

    function camera() {

        var directive = {
            restrict: 'E',
            scope: {
                id:"@",
                image:"=",
                close:"&",
                active:"="
            },
            templateUrl: 'app/components/camera/camera.html',
            controller: 'CameraController',
            controllerAs: 'camera'
        };

        return directive

        ////////////////////////////////////////


        }

    }
)();



(function () {
    'use strict';
    angular
        .module('camera')
        .controller('CameraController', CameraController)

    CameraController.$inject = ['$scope', '$ionicPopup', 'image', 'crop', 'draw', '$ionicActionSheet', '$ionicPlatform', '$cordovaImagePicker', '$cordovaCamera','$ionicLoading'];


    function CameraController($scope, $ionicPopup, image, crop, draw, $ionicActionSheet, $ionicPlatform, $cordovaImagePicker, $cordovaCamera,$ionicLoading) {
        

        

        var self = this;

        self.backupImage = {};
        self.colour = {};
        self.layers = {};
        self.objects = {};
        self.colour.value = "#0AAECA";
        self.panel="start";
        self.changes = false;
        
        self.activate = activate;
        self.loadImage = loadImage;
        self.reset = reset;
        self.initRevert = initRevert;
        self.save = save;
        self.initCrop = initCrop;
        self.finishCrop = finishCrop
        self.startDrawing = startDrawing;
        self.stopDrawing = stopDrawing;
        self.undo = undo;
        self.discardChanges = discardChanges;
        self.initDelete = initDelete;
        self.deleteImage = deleteImage;
        self.cancel = cancel;
        self.CTA = CTA;
        self.isActive = isActive;
        self.textCTA = textCTA;
        self.retake = retake;
        self.changeColour = changeColour;
        self.loadActionSheet = loadActionSheet;
        self.fromGallery = fromGallery;
        self.fromCamera = fromCamera;
        
        $scope.$on('modal.shown', function(event, modal) {
            if(modal.id=="camera" && !($scope.image) && $scope.active){
                reset();
                self.backupImage = {};
                delete self.saved;
      retake();}
    });




        ////////////////////

        //NOTE, this function is used by the kinetic-stage directive link function
        function activate() {
           
            
            if($scope.image){
            loadImage($scope.image).then(function(){
                self.changes = false;
    
                
            });
            
            }
            


        }
        
        function switchTo(panelLabel){
            self.panel = panelLabel;
        }
        
        function isActive(panelLabel){
             return self.panel == panelLabel;
        }
        
        function retake(){
            
            
            if(ionic.Platform.isWebView()){
                
               loadActionSheet();
                
            }
            else{
            document.getElementById("attach-input-"+$scope.id).click();
            }
          
        }
        
        function loadActionSheet(){
            
         $ionicActionSheet.show({
     buttons: [
       { text: '<i class="icon sqd-icon-camera positive"></i> Camera' },
       { text: '<i class="icon ion-images assertive"></i> Gallery' }
     ],
     titleText: 'Get image from:',
     cancelText: 'Cancel',
     cancel: function() {
          if(Object.keys(self.backupImage).length === 0){
          $scope.close();
          }
        },
     buttonClicked: function(index) {
         $ionicLoading.show();
         if(index==0){
         fromCamera();
         }
         else{
         fromGallery()
         }
       return true;
     }
   });
        
        }
        
        function fromGallery() {

            try {
                $ionicPlatform.ready(function () {

                    var options = {
                        maximumImagesCount: 1,
                        width: 0,
                        height: 0,
                        quality: 100
                    };

                    $cordovaImagePicker.getPictures(options).then(processImage, handleLoadError);

                });
            } 
            catch (error) {
               $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Failed to load gallery :-(',
                    okType: "button-assertive"
                }).then(function () {
                    if (Object.keys(self.backupImage).length === 0) {
                        $scope.close()
                    }
                });
            }


            //////////////////////////////


            function processImage(results) {
                for (var i = 0; i < results.length; i++) {
                    loadImage(results[i]);
                }
                if(results.length==0){
                    $ionicLoading.hide();
                if (Object.keys(self.backupImage).length === 0) {
                     
                        $scope.close();
                    }
                }
            }

            function handleLoadError(error) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Failed to load image from gallery :-(',
                    okType: "button-assertive"
                }).then(function () {
                    if (Object.keys(self.backupImage).length === 0) {
                        $scope.close()
                    }
                });
            }



        }
        
        
        function fromCamera() {

            try {
                $ionicPlatform.ready(function () {

                    var options = {
                        destinationType: Camera.DestinationType.FILE_URI,
                        sourceType: Camera.PictureSourceType.CAMERA,
                    };



                    $cordovaCamera.getPicture(options).then(processImage, handleLoadError);

                });
            } catch (error) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Failed to load camera :-(',
                    okType: "button-assertive"
                }).then(function () {
                    if (Object.keys(self.backupImage).length === 0) {
                        $scope.close()
                    }
                });
            }


            //////////////////////////////

            function processImage(imageURI) {

                if (imageURI) {

                    loadImage(imageURI);
                } else {
                    $ionicLoading.hide();
                    if (Object.keys(self.backupImage).length === 0) {
                        $scope.close();
                    }
                }

            }

            function handleLoadError(error) {
                 $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Failed to load image from camera :-(',
                    okType: "button-assertive"
                }).then(function () {
                    if (Object.keys(self.backupImage).length === 0) {
                        $scope.close()
                    }
                });

            }



        }


        function changeColour(colour){
            
            switch (colour) {
                case 'red':
                    self.colour.value = "#FF2A01"
                    break;
                case 'blue':
                    self.colour.value = "#0AAECA"
                    break;
                case 'green':
                    self.colour.value = "#0BCA6A"
                    break;
                 case 'yellow':
                    self.colour.value = "#F4E101"
                    break;
                default:
                     self.colour.value = "#0AAECA"
                    break;
            }
                    
        }
    
        
        

        function loadImage(input) {
            
            var dataURI;
            
            if(typeof input === 'string'){
                
                dataURI = input;
                
            }
            
            else{
                $ionicLoading.show();
                dataURI = URL.createObjectURL(input.files[0]);
                input.value='';
            }



           return image.load(dataURI).then(function (data) {
                reset();

                
                self.backupImage = data;
                image.render(self.stage, self.layers, self.objects, data);
                    self.changes = true;
               self.overwritingOldImage = $scope.image ? true : false;
                delete self.saved;
               $ionicLoading.hide();
             
            }).catch(function(){
               
               $ionicLoading.hide();
           });


        }




        function reset() {


            self.stage.clear();

            angular.forEach(self.stage.children, function (layer, key) {

                layer.destroy();

            });



            self.layers = {};
            self.objects = {};
            switchTo("start");
             self.changes = false;




        }





        function initCrop() {
            if(!isActive("crop")){

            switchTo("crop");
            self.layerCrop = crop.start(self.stage, self.layers, self.objects);
            }


        }

        function finishCrop() {


            crop.finish(self.stage, self.layers, self.objects, self.backupImage);
            self.changes = true;
            switchTo("start");

        }
        
        function cancelCrop(){
        crop.cancel(self.layers);
             switchTo("start");
        }
        
        function initRevert(){
                      if(!isActive("reset")){
            switchTo("reset");
               var confirmPopup = $ionicPopup.confirm({
     title: 'Reset Image',
     template: 'Are you sure you want to discard <strong>ALL</strong> your changes?',
                       okType: "button-energized"
                   
   });
   confirmPopup.then(function(res) {
     if(res) {
       revert();
     } else {
          switchTo("start");
     }
   });
                      }
        
        }

        function revert() {
            reset();
            image.render(self.stage, self.layers, self.objects, self.backupImage);
            self.changes = true;
             switchTo("start");


        }

        function save() {


            image.save(self.stage, self.layers, self.objects).then(function (data) {

                $scope.image = data.image;
                
               var img = {
                  thumb: data.image,
                  url: data.image,
                  from: 'device',
                  type: 'image'
              };
                
                $scope.close({
                    img: img,
                    id: $scope.id
                });
                self.saved = data.saved;
                
              self.changes = false;

            })
            
            

        }

        function startDrawing() {
            if(!isActive("draw")){

            switchTo("draw");
            draw.start(self.stage, self.layers, self.objects, self.colour);
            }

        }

        function stopDrawing() {

            draw.stop(self.objects);
            self.changes = true;
            switchTo("start");

        }

        function undo(all) {
            all = all ? all : false
            
            if (self.objects.lines) {
                draw.undo(self.stage, self.layers, self.objects, all);
            }

        }

        function discardChanges() {
if(self.saved){
            image.discardChanges(self.stage, self.layers, self.objects, self.saved);
    
                   var img = {
                  thumb: $scope.image,
                  url: $scope.image,
                  from: 'device',
                  type: 'image'
              };

            $scope.close({
                img: img,
                id: $scope.id
            });}
            else if(self.overwritingOldImage){
                
                var img = {
                  thumb: $scope.image,
                  url: $scope.image,
                  from: 'device',
                  type: 'image'
              };
                
                 reset();
                self.backupImage = {};
                activate();
                
                $scope.close({
                img: img,
                id: $scope.id
            });
                
            }
            else{
            deleteImage();
            }
            
            self.changes = false;


        }
        
        function initDelete(){
                      if(!isActive("delete")){
                    switchTo("delete");
               var confirmPopup = $ionicPopup.confirm({
     title: 'Delete Image',
     template: 'Are you sure you want to delete your image?',
    okType: "button-energized"
   });
   confirmPopup.then(function(res) {
     if(res) {
       deleteImage();
     } else {
          switchTo("start");
     }
   });
        }
        }

        function deleteImage() {

            reset();
            
            self.backupImage = {};
            delete self.saved;
           
            $scope.close({
                 id: $scope.id
            });




        }
        
        function cancel(){
            
            switch (self.panel) {
                case 'start':
            if (self.changes){
                
                
   var confirmPopup = $ionicPopup.confirm({
     title: 'Discard Changes',
     template: 'Are you sure you want to discard your most recent changes?',
           okType: "button-energized"
   });
   confirmPopup.then(function(res) {
     if(res) {
       discardChanges();
     } else {
     }
   });
             
            }
            else{
                 $scope.close();
            }
                    break;
                case 'crop':
                cancelCrop();
                switchTo("start");
                    break;
                case 'draw':
                    var all = true;
                    undo(all);
                switchTo("start");

                    break;
                case 'reset':
            switchTo("start");

                    break;
                case 'delete':
            switchTo("start");
                       break;
                default:
                    break;
                }
            
              
        
        
        }
        
        
        
        
        
        
        
        
        
        function textCTA(){
    var text

            switch (this.panel) {
                case 'start':
    text = "Attach"
                    break;
                case 'crop':
     text = "Crop";
                    break;
                case 'draw':
    text = "OK";

                    break;
                case 'reset':
    text = "Reset";

                    break;
                case 'delete':
    text = "Delete";
                       break;
                default:
                    break;
                }

    return text
}



        function CTA(){

        switch (this.panel) {
                case 'start':
                    save();
                    break;
                case 'crop':
                    finishCrop();
                switchTo('start');
                    break;
                case 'draw':
                stopDrawing();
                switchTo('start');
                    break;
                case 'reset':
                    revert();
                switchTo('start');
                    break;
                case 'delete':
                    deleteImage();
                switchTo('start');
                       break;
                default:
                    break;
                }

}
        
        
        
        
        








    }




})();
(function () {

    angular
        .module('camera')
        .directive('kineticStage', kineticStage)

    kineticStage.$inject = ['Kinetic'];
    
           /**
         * @ngdoc directive
         * @name camera.directive:kineticStage
         * @restrict A
         * @element div
         * @description
         * Creates a kinetic stage within this div, which is registered on the camera controller under the "stage" variable
         */

    function kineticStage(Kinetic) {

        var directive = {
            restrict: 'A',
            require: '^camera',
            link: link
        };

        return directive

        ////////////////////////////////////////
        
        function link(scope, element, attrs, cameraController){
            
             cameraController.stage = new Kinetic.Stage({
                container: element[0],
                width: window.innerWidth,
                height: window.innerHeight-120

            });
            
            cameraController.activate();

        
        }


        }

    }
)();



(function () {
    'use strict';
    angular
        .module('camera')
        .factory('image', image);

    image.$inject = ['$q', 'Kinetic', 'EXIF', 'exceptions'];

    /**
     * @ngdoc service
     * @name camera.service:image
     * @param {object} $q Angular promise service
     * @param {object} Kinetic Kinetic.js wrapped in angular service
     * @param {object} EXIF EXIF.js wrapped in angular service
     * @param {object} exceptions Service to catch a failed promise
     * @returns {object} Service object exposing methods - load, render, save, discardChanges
     *
     * @description
     * This is a service used to deal with the non-UI specific parts of the camera service (i.e. not drawing or cropping)
     */


    function image($q, Kinetic, EXIF, exceptions) {


        var service = {

            load: load,
            render: render,
            save: save,
            discardChanges: discardChanges

        };

        return service;



        ////////////////////////////////////////

        /**
         * @ngdoc method
         * @name load 
         * @methodOf  camera.service:image
         * @param {string} dataURI dataURI of an image (can also be a url from the web in principle)
         * @returns {promise} Resolves to an object with keys image, aspect, orientation, width, height -  if url was successfully loaded, otherwise the promise is rejected
         * 
         * @description Create an image object from a dataURI and extracts some useful information about it. Takes into account strange orientation problems with images takes with an iphone
         * @example
         * <pre>image.load('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')</pre>
         * 
         */

        function load(dataURI) {

            var deferred = $q.defer(),
                image = new Image();

            //Important, onload must come before src.
            image.onload = onload;
            image.onerror = function () {
                exceptions.create('Error loading image', deferred)('Error in image.load');
            };
            image.src = dataURI;


            return deferred.promise;


            ////////////////////////////////////////

            function onload() {

                var orientation,
                    aspect,
                    width,
                    height;

                EXIF.getData(this, function () {

                    // This might look strange but it has to do with the fact that iphones do strange things (iphone has orientation = 6 for potrait)
                    orientation = EXIF.getTag(this, "Orientation");
                    if (typeof orientation !== 'undefined' && orientation == 6) {
                        width = this.height;
                        height = this.width;
                    } else {
                        width = this.width;
                        height = this.height;
                    }


                    aspect = width / height;

                    deferred.resolve({
                        image: image,
                        aspect: aspect,
                        orientation: orientation,
                        width: width,
                        height: height
                    });

                });



            }





        }



        /**
         * @ngdoc method
         * @name render 
         * @methodOf  camera.service:image
         * @param {object} stage Kinetic.js stage object where the image layer will be created
         * @param {object} layers Contains layers that have kinetic.js objects on them. A new "image" layer will be added to this "layers" object
         * @param {object} objects Contains objects that have been drawn onto the various layers defined in the layers object, a new "image" object will be added to this "objects" object, which is a kinetic image with some extra properties added to take into account strange things iphone does with portrait images
         * @param {object} image JSON object containing keys image, aspect, orientation, width, height, where image is a javascript image object. This is what is returned from the "image.load" method
         * 
         * @description Renders a loaded image onto a kinetic layer and onto a given kinetic stage
         */
        function render(stage, layers, objects, image) {

            layers.image = new Kinetic.Layer();
            stage.add(layers.image);

            var layer = layers.image,
                aspectStage = stage.getWidth() / stage.getHeight(),
                w,
                h,
                xpos,
                ypos,
                img;

            if (image.aspect / aspectStage < 1) {
                w = image.aspect / aspectStage * stage.getWidth();
                h = w / image.aspect;
            } else {
                w = stage.getWidth();
                h = w / image.aspect;

            }

            xpos = (stage.getWidth() - w) / 2;
            ypos = (stage.getHeight() - h) / 2;


            if (image.orientation != 6) {
                // normal image
                img = new Kinetic.Image({
                    x: (stage.getWidth() - w) / 2,
                    y: (stage.getHeight() - h) / 2,
                    image: image.image,
                    width: w,
                    height: h,
                    name: 'image',
                });
            } else {
                img = new Kinetic.Image({
                    // iphone portrait image. n.b we'll need to not only rotate the image but shift it so that we have the correctly positioned rotation axis
                    x: stage.getWidth() / 2,
                    y: stage.getHeight() / 2,
                    image: image.image,
                    width: h,
                    height: w,
                    name: 'image',
                    offset: {
                        x: h / 2,
                        y: w / 2
                    }
                });

                img.rotate(90);

            }

            // We add some extra properties to the kinetic image object due to the fact that we might have one of these strange iphone portrait photos.  e.g. kinetic width will actually be the photos real height and the position of the image will be its original position before we rotated it.  We need the position as it is seen on screen for when we start to do cropping.
            img.xpos = (stage.getWidth() - w) / 2;
            img.ypos = (stage.getHeight() - h) / 2;
            img.width = w;
            img.height = h;
            img.aspect = image.aspect;




            layer.add(img);

            layer.draw();

            objects.image = img;

            return




        }


        /**
         * @ngdoc method
         * @name save 
         * @methodOf  camera.service:image
         * @param {object} stage Kinetic.js stage object where the layers live
         * @param {object} layers Contains layers that have kinetic.js objects on them.
         * @param {object} objects Contains objects that have been drawn onto the various layers defined in the layers object
         * @returns {promise} Resolves to an object with keys image (a dataURI), saved (a backup object containing crop information and drawings to be used if we make additional changes and want to revert back to this version) -  if the image was successfully loaded, otherwise the promise is rejected.
         * 
         * @description Saves the image and anything that has been drawn on top of it as a dataURI. Creates a backup of the current state of the image so that we can revert back if desired
         * 
         */
        function save(stage, layers, objects) {

            var deferred = $q.defer(),
                image = objects.image;

            // The reason we don't just take a JSON copy of the image layer is that Im not sure whether the extra properties we previously attached to the kinetic image (because of iphone orientaiton issues) wil survive
            var saved = {
                crops: {
                    pos: image.position(),
                    size: image.size(),
                    crop: image.crop(),
                    offset: image.offset()
                }

            };
            

            if (layers.drawing) {
                saved.drawing = {};
                saved.drawing = layers.drawing.toJSON();

            }

            stage.toImage({
                mimeType: "image/jpeg",
                quality: 0.9,
                x: image.xpos,
                y: image.ypos,
                width: image.width,
                height: image.height,
                callback: function (savedImage) {

                    deferred.resolve({
                        image: savedImage.src,
                        saved: saved
                    })

                }
            });

            return deferred.promise

        }



        /**
         * @ngdoc method
         * @name discardChanges 
         * @methodOf  camera.service:image
         * @param {object} stage Kinetic.js stage object where the layers live
         * @param {object} layers Contains layers that have kinetic.js objects on them.
         * @param {object} objects Contains objects that have been drawn onto the various layers defined in the layers object
         * @param {object} saved object containing information about drawings and crops made before the image was last saved. These stage will be reverted back to this state
         * 
         * @description Discards any changes that have been made since the image was last saved
         * 
         */
        function discardChanges(stage, layers, objects, saved) {

            var image = objects.image,
                layerDraw,
                layerImage;
            
            /* layers.image.destroy();
            
            layerImage= Kinetic.Node.create(saved.crops);
            stage.add(layerImage);
            layers.image = layerImage;*/

            image.position(saved.crops.pos);
            image.size(saved.crops.size);
            image.crop(saved.crops.crop);
            image.offset(saved.crops.offset);

            layers.image.draw();

            if (layers.drawing) {


                layers.drawing.destroy();

                if (saved.drawing) {

                    layerDraw = Kinetic.Node.create(saved.drawing);

                    objects.lines = [];
                    angular.forEach(layerDraw.children, function (line, key) {

                        objects.lines.push(line);

                    });


                    layers.drawing = layerDraw;

                    stage.add(layerDraw);

                    layerDraw.draw();
                }

            }

            return

        }









    }









})();
(function () {
    'use strict';
    angular
        .module('camera')
        .factory('crop', crop);

    crop.$inject = ['$q', 'Kinetic', 'exceptions'];

    /**
     * @ngdoc service
     * @name camera.service:crop
     * @param {object} $q Angular promise service
     * @param {object} Kinetic Kinetic.js wrapped in angular service
     * @param {object} EXIF EXIF.js wrapped in angular service
     * @param {object} exceptions Service to catch a failed promise
     * @returns {object} Service object exposing methods - start, finish, cancel
     *
     * @description
     * This is a service used do crop an image through user interaction
     */


    function crop($q, Kinetic, exceptions) {


        var service = {

            start: start,
            finish: finish,
            cancel: cancel

        };

        return service;



        ////////////////////////////////////////

        /**
         * @ngdoc method
         * @name start
         * @methodOf  camera.service:crop
         * @param {object} stage Kinetic.js staage object where the image layer is
         * @param {object} layers Contains layers that have kinetic.js objects on them
         * @param {object} objects Contains objects that have been drawn onto the various layers defined in the layers object
         *
         * @description Initialises the copping interface
         */

        function start(stage, layers, objects) {

            var layer,
                image,
                w,
                h,
                xpos,
                ypos,
                aspectImage;

            // Create the layer that will hold all of the cropping objects
            layer = new Kinetic.Layer(),
                stage.add(layer);
            layers.crop = layer;


            image = objects.image;

            // This is using the real width and height of the image as is seen on screen, which is not necessarily the same as the width and height that the image has.  This is because we might have needed to rotate the image if it is a portrait photo coming fom iphone.
            w = image.width;
            h = image.height;

            xpos = image.xpos;
            ypos = image.ypos;
            aspectImage = image.aspect;


            createCroppingObjects();

            createEventListeners();


            layer.draw();




            ////////////////////////////////////////


            function createCroppingObjects() {

                var squareGroup,
                    square,
                    xSquare,
                    ySquare,
                    wSquare,
                    hSquare,
                    xCentre,
                    yCentre,
                    fadeLeft,
                    fadeTop,
                    fadeRight,
                    fadeBottom;

                //  These set up the correct dimensions to that when the cropping square is displayed it appears centred on the image at the largest possible size. While we dont need width and height because it is a square, we keep both in case we want to change this in the future
                wSquare = aspectImage > 1 ? h : w;
                hSquare = wSquare;
                xCentre = stage.getWidth() / 2;
                yCentre = stage.getHeight() / 2;
                xSquare = xCentre - wSquare / 2;
                ySquare = yCentre - hSquare / 2;

                 addFade(layer, {x: xpos, y: ypos}, {width: xSquare - xpos, height: h}, 'fadeLeft');
                addFade(layer, {x: xSquare, y: ypos}, {width: w - (xSquare - xpos), height: ySquare - ypos}, 'fadeTop');
                addFade(layer, {x: xSquare, y: ySquare + hSquare}, {width: w - (xSquare - xpos), height: h - hSquare - (ySquare - ypos)}, 'fadeBottom');
                addFade(layer, {x: xSquare + wSquare, y: ySquare}, {width: w - (xSquare - xpos) - wSquare, height: hSquare}, 'fadeRight');




                square = new Kinetic.Rect({
                    x: 0,
                    y: 0,
                    width: wSquare,
                    height: hSquare,
                    stroke: "white",
                    id: 'crop'
                });

                // The addition of a dragBoundFunc means that the cropping area will never leave the bounds of the image
                squareGroup = new Kinetic.Group({
                    x: xSquare,
                    y: ySquare,
                    draggable: true,
                    dragBoundFunc: function (pos) {
                        var newY = pos.y < ypos ? ypos : ((pos.y + square.getWidth()) > (ypos + h) ? ypos + h - square.getWidth() : pos.y);

                        var newX = pos.x < xpos ? xpos : ((pos.x + square.getWidth()) > (xpos + w) ? xpos + w - square.getWidth() : pos.x);


                        return {
                            x: newX,
                            y: newY
                        }
                    },
                    id: 'squareGroup'

                });

                squareGroup.add(square);

                addAnchor(squareGroup, 0, 0, 'topLeft');
                addAnchor(squareGroup, wSquare, 0, 'topRight');
                addAnchor(squareGroup, wSquare, wSquare, 'bottomRight');
                addAnchor(squareGroup, 0, wSquare, 'bottomLeft');

                layer.add(squareGroup);



                return


                ////////////////////////////////////////

                // This adds a semi transparrent black area on the iamge that helps to show which bit of the image will be lost after the crop
                function addFade(layer, pos, size, id) {

                    var fade = new Kinetic.Rect({
                        x: pos.x,
                        y: pos.y,
                        width: size.width,
                        height: size.height,
                        fill: "black",
                        opacity: 0.5,
                        id: id,
                        name:'fade',
                        draggable: false,
                        listening: false
                    });
                    layer.add(fade);

                    return
                }

                // This adds an anchor on a corner of the sqaure cropping area.  The user will be able to use these to resize the crop, once events are attached to them
                function addAnchor(group, x, y, id) {

                    var anchor = new Kinetic.Circle({
                        x: x,
                        y: y,
                        fill: '#ddd',
                        stroke:'#ddd',
                        strokeWidth:1,
                        radius: 15,
                        id: id,
                        name: 'anchor',
                        draggable: true,
                        dragBoundFunc: function (pos) {

  /*                          var squareWidth = square.getWidth();

                            var y = square.getAbsolutePosition().y;
                            var x  = square.getAbsolutePosition().x;


                        var newY = y < ypos ? ypos + gridPos.y*squareWidth : ((y + squareWidth) > (ypos + h) ? ypos + h - (squareWidth - gridPos.y)*squareWidth: pos.y);

                        var newX = x < xpos ? xpos + gridPos.x*squareWidth : ((x + squareWidth) > (xpos + w) ? xpos + w - (squareWidth - gridPos.x)*squareWidth: pos.x);*/



                        var newY = pos.y < ypos ? ypos : (pos.y > (ypos + h) ? ypos + h : pos.y);

                        var newX = pos.x < xpos ? xpos : (pos.x > (xpos + w) ? xpos + w : pos.x);


                        return {
                            x: newX,
                            y: newY
                        }
                    },
                        dragOnTop: false
                    });
                    group.add(anchor);

                    return
                }




            }



            function createEventListeners() {

                    var topLeft = stage.find('#topLeft')[0],
                        topRight = stage.find('#topRight')[0],
                        bottomRight = stage.find('#bottomRight')[0],
                        bottomLeft = stage.find('#bottomLeft')[0],
                        fadeLeft = stage.find('#fadeLeft')[0],
                        fadeTop = stage.find('#fadeTop')[0],
                        fadeBottom = stage.find('#fadeBottom')[0],
                        fadeRight = stage.find('#fadeRight')[0],
                        cropArea = stage.find('#crop')[0],
                        squareGroup = stage.find('#squareGroup')[0];


                createEventsForSquareGroup();

                createEventsForAnchors();

                 ///////////////////////////////////////////////////

                function createEventsForSquareGroup(){


                     // This makes sure that when we move the square around that the faded areas change shape and posititon to match
                    squareGroup.on('dragmove', updateFadedAreas);

                }

                function createEventsForAnchors() {

                    var anchors = stage.find('.anchor');


                    anchors.forEach(function (anchor) {

                        anchor.on('dragmove', function () {

                            //  When we move one of the anchors we want the other to move to keep it a square and to keep the square centred on where it started
                            updateAnchors(this);

                            // As we move the anchors the square needs to move and resize accordingly
                            updateCropArea();

                            // This makes sure that when we move the anchors the faded areas change shape and posititon to match
                            updateFadedAreas();


                        });
                        anchor.on('mousedown touchstart', function () {
                            // This is the stop the origin of the group accidently moving around when we adjust the anchors.  This is important when we come to readjust the origin of the cropping group upon ending the user interaction
                            squareGroup.setDraggable(false);
                        });
                        anchor.on('dragend', function () {

                            // When we have been moving the anchors the group origin has remained fixed and our coordinates have been relative to that.  When we stop the topLeft anchor is not going to be at the origin of the group (which is how we originally defined it), so we need to move the group origin and then adjust the coordiantes or all the anchors.
                            moveGroupOrigin();

                            // Once the origin has been re-adjusted we are free to drag the whole cropping area around
                            squareGroup.setDraggable(true);

                        });



                    });



                }






                // Formally this could be implemendted when we set up the objects in the beginning, but it feels a bit more transparent to have it explicitly in its own function.  I can't see that it will cause an obvious performance problem
                function updateFadedAreas() {

                    var width = topRight.x() - topLeft.x(),
                        height = bottomLeft.y() - topLeft.y();

                    // Remember when we need to refernce things relative to the top left corner of the image, so when we look at posititons we need to subtract the xpos or ypos to get what we want.  Also recall w is width of image and width is width of the cropping area, similarly for height
                    fadeLeft.setWidth(topLeft.getAbsolutePosition().x - xpos);

                    fadeTop.x(fadeLeft.x() + fadeLeft.getWidth());


                    fadeTop.setWidth(w - (topLeft.getAbsolutePosition().x - xpos));
                    fadeTop.setHeight(topLeft.getAbsolutePosition().y - ypos);

                    fadeBottom.x(topLeft.getAbsolutePosition().x);
                    fadeBottom.y(topLeft.getAbsolutePosition().y + height);
                    fadeBottom.setWidth(w - (topLeft.getAbsolutePosition().x - xpos));
                    fadeBottom.setHeight(h - (topLeft.getAbsolutePosition().y - ypos) - height);


                    fadeRight.x(topLeft.getAbsolutePosition().x + width);
                    fadeRight.y(topLeft.getAbsolutePosition().y);
                    fadeRight.setWidth(w - (topLeft.getAbsolutePosition().x + width - xpos));
                    fadeRight.setHeight(height);



                }








                function updateAnchors(activeAnchor) {

                    var group = activeAnchor.getParent();

                    var anchorX = activeAnchor.x();
                    var anchorY = activeAnchor.y();



                    switch (activeAnchor.id()) {

                        case 'topLeft':

                            var hor = topRight,
                                vert = bottomLeft,
                                opp = bottomRight,
                                sign = {
                                    x: 1.0,
                                    y: 1.0
                                };

                            break



                        case 'topRight':

                            var hor = topLeft,
                                vert = bottomRight,
                                opp = bottomLeft,
                                sign = {
                                    x: -1.0,
                                    y: 1.0
                                };


                            break;

                        case 'bottomRight':

                            var hor = bottomLeft,
                                vert = topRight,
                                opp = topLeft,
                                sign = {
                                    x: -1.0,
                                    y: -1.0
                                };


                            break;

                        case 'bottomLeft':

                            var hor = bottomRight,
                                vert = topLeft,
                                opp = topRight,
                                sign = {
                                    x: 1.0,
                                    y: -1.0
                                };





                            break;
                    }


                    //  When we move one of the anchors we want the other to move to keep it a square and to keep the square centred on where it started
                    moveOtherAnchors(hor, vert, opp, sign);



                    ///////////////////////////////////////////////////


                    function moveOtherAnchors(hor, vert, opp, sign) {

                        var distX = anchorX - vert.x();
                        var distY = anchorY - hor.y();
                        var oldX = vert.x();
                        var oldY = hor.y();
                        var side;
                        // Ensures that the anchors dont get so close they are on top of each other, i.e. sits minimum size of cropping region and stops the crop from inverting
                        if (sign.x * (hor.x() - anchorX) > 32 && sign.y * (vert.y() - anchorY) > 32) {

                            if (Math.abs(distX) >= Math.abs(distY)) {

                                hor.x(hor.x() - distX);
                                hor.y(anchorY);
                                side = sign.x * sign.y * (hor.x() - anchorX);
                                vert.x(anchorX);
                                vert.y(anchorY + side);


                            } else {
                                vert.x(anchorX);
                                vert.y(vert.y() - distY);
                                side = sign.x * sign.y * (vert.y() - anchorY);
                                hor.x(anchorX + side);
                                hor.y(anchorY);

                            }

                            opp.x(hor.x());
                            opp.y(vert.y());
                        } else {
                            activeAnchor.y(oldY);
                            activeAnchor.x(oldX);
                        }


                    }




                }

                // As we move the anchors the square needs to move and resize accordingly
                function updateCropArea() {

                    cropArea.setPosition(topLeft.getPosition());

                    var width = topRight.x() - topLeft.x();
                    var height = bottomLeft.y() - topLeft.y();

                    cropArea.setSize({
                        width: width,
                        height: height
                    });
                }


                // Puts the group origin back to be the same as he topLeft anchor.  In order not to have everything suddenly move around we need to adjust the anchor positions afterwards
                function moveGroupOrigin(){

                            var width = topRight.x() - topLeft.x(),
                                height = bottomLeft.y() - topLeft.y();

                        squareGroup.x(topLeft.getAbsolutePosition().x);
                        squareGroup.y(topLeft.getAbsolutePosition().y);

                            topRight.position({
                                x: width,
                                y: 0
                            });

                            bottomRight.position({
                                x: width,
                                y: height
                            });

                            bottomLeft.position({
                                x: 0,
                                y: height
                            });

                            topLeft.position({
                                x: 0,
                                y: 0
                            });

                            cropArea.position({
                                x: 0,
                                y: 0
                            });


                }









                }









            return









        }



        /**
         * @ngdoc method
         * @name finish
         * @methodOf  camera.service:crop
         * @param {object} stage Kinetic.js staage object where the image layer is
         * @param {object} layers Contains layers that have kinetic.js objects on them
         * @param {object} objects Contains objects that have been drawn onto the various layers defined in the layers object
         * @param {object} imgOrig JSON object containing keys image, aspect, orientation, width, height, where image is a javascript image object. This is what is returned from the "image.load" method and stored as a backup
         *
         * @description Renders a loaded image onto a kinetic layer and onto a given kinetic stage
         *
         */
        function finish(stage, layers, objects, imgOrig) {

            // First get some information about the image, including whether or not the image has already been cropped by using the crop property
            var image = objects.image,
                xImage = image.x(),
                yImage = image.y(),
                wImage = image.getWidth(),
                hImage = image.getHeight(),
                xOffset = image.crop().x,
                yOffset = image.crop().y;

            // Now define "original" width and height, but by original we mean the image on screen before it is about to be cropped.  This is not the same as the image width and height unless this is the first crop.
            var wOrig = image.crop().width == 0 ? imgOrig.width : image.crop().width,
                hOrig = image.crop().height == 0 ? imgOrig.height : image.crop().height;

            // Next we get the information about the position and dimensions of the cropping area. note that althought the crop is a square we have kept some extra more general code in case we want to change our mind at some point in the future
            var cropArea = cropArea = stage.find('#crop')[0],
                topLeft = stage.find('#topLeft')[0],
                xCrop = topLeft.getAbsolutePosition().x,
                yCrop = topLeft.getAbsolutePosition().y,
                wCrop = cropArea.getWidth(),
                hCrop = cropArea.getHeight(),
                aspectCrop = wCrop / hCrop;


            // Now that we have extracted all the spatial information about the crop we dont need it anymore so we can destroy the layer
            layers.crop.destroy();


            var aspectStage = stage.getWidth() / stage.getHeight(),
                w,
                h;

            if (aspectCrop / aspectStage < 1) {
                w = aspectCrop / aspectStage * stage.getWidth();
                h = w / aspectCrop;
                if(layers.drawing){
                    // If we have lines on the drawing when we crop those lines are scaled up but in order to not see them outside of the boundary of the image we need to hide them by putting a black layer over the top
                    var hide1 = createDrawingMasks({x: 0, y: 0}, {width: (stage.getWidth() - w) / 2, height: stage.getHeight()}),
                        hide2 = createDrawingMasks({x: (stage.getWidth() - w) / 2 + w, y: 0}, {width: (stage.getWidth() - w) / 2, height: stage.getHeight() });
                }
            } else {
                w = stage.getWidth();
                h = w / aspectCrop;
                 if(layers.drawing){
                     var hide1 = createDrawingMasks({x: 0, y: 0}, {width: stage.getWidth(), height: (stage.getHeight() - h) / 2}),
                         hide2 = createDrawingMasks({x: 0, y: (stage.getHeight() - h) / 2 + h}, {width: stage.getWidth(), height: (stage.getHeight() - h) / 2 });
                }

            }

            // Now we know the new position and dimensions of our cropped image on the screen we need to update it
            image.xpos = (stage.getWidth() - w) / 2;
            image.ypos = (stage.getHeight() - h) / 2;
            image.width = w;
            image.height = h;



            // This is the bit that will actually do the cropping.  Orientation==6 is an iphone portrait photo which we has to be dealt with in a special way
            if (imgOrig.orientation != 6) {

                image.position({
                    x: (stage.getWidth() - w) / 2,
                    y: (stage.getHeight() - h) / 2
                });
                image.crop({
                    x: (xCrop - xImage) / wImage * wOrig + xOffset,
                    y: (yCrop - yImage) / hImage * hOrig + yOffset,
                    width: wCrop / wImage * wOrig,
                    height: hCrop / hImage * hOrig
                });
                image.size({
                    width: w,
                    height: h
                });

            }
            else {

                xImage = xImage - hImage / 2;
                yImage = yImage - wImage / 2;

                image.position({
                    x: stage.getWidth() / 2,
                    y: stage.getHeight() / 2
                });
                image.crop({
                    y: ((xImage + hImage) - (xCrop + wCrop)) / hImage * wOrig + yOffset,
                    x: (yCrop - yImage) / wImage * hOrig + xOffset,
                    height: wCrop / hImage * wOrig,
                    width: hCrop / wImage * hOrig
                });
                image.size({
                    width: h,
                    height: w
                });
                image.offset({
                    x: h / 2,
                    y: w / 2
                });

            }

             layers.image.draw();



            // Finally if we have any drawings on the image we have to scale the distances between the points on the lines so that the lines appear in the same place on the zoomed image
            if (layers.drawing) {
                var lines = objects.lines;

                for (var i = 0; i < lines.length; i++) {

                    var temp = lines[i].points();
                    for (var j = 0; j < temp.length - 1; j += 2) {
                        temp[j] = (temp[j] - xCrop) * w / wCrop + (stage.getWidth() - w) / 2;
                        temp[j + 1] = (temp[j + 1] - yCrop) * h / hCrop + (stage.getHeight() - h) / 2;

                    }
                    lines[i].points(temp);

                }

                layers.drawing.add(hide1);
                layers.drawing.add(hide2);
                layers.drawing.draw();


            }







            ///////////////////////////////////////////////////

        function createDrawingMasks(pos, size){

            var hide = new Kinetic.Rect({ // overlay
                    x: pos.x,
                    y: pos.y,
                    width: size.width,
                    height: size.height,
                    fill: "#212224",
                    opacity: 1,
                    /*dash: [10, 5],*/
                    draggable: false,
                    listening: false



            })
             return hide

         }




        }

                /**
         * @ngdoc method
         * @name cancel
         * @methodOf  camera.service:crop
         * @param {object} layers Contains layers that have kinetic.js objects on them
         *
         * @description Cancels the current crop
         *
         */
        function cancel(layers){

         layers.crop.destroy();

        }







    }

})();

(function () {
    'use strict';
    angular
        .module('camera')
        .factory('draw', draw);

    draw.$inject = ['$rootScope', 'Kinetic'];

    /**
     * @ngdoc service
     * @name camera.service:draw
     * @param {object} $rootScope, Angular rootScope service
     * @param {object} Kinetic Kinetic.js wrapped in angular service
     * @returns {object} Service object exposing methods - start, stop, undo
     *
     * @description
     * This is a service used to draw on an kineticjs image
     */


    function draw($rootScope,Kinetic) {


        var service = {

            start: start,
            stop: stop,
            undo: undo

        };
        
        var backup;

        return service;



        ////////////////////////////////////////

        /**
         * @ngdoc method
         * @name start 
         * @methodOf  camera.service:draw
         * @param {object} stage Kinetic.js staage object where the image layer is
         * @param {object} layers Contains layers that have kinetic.js objects on them, a key named "drawing" must be present whose value must be a kinetic.js layer
         * @param {object} objects Contains objects that have been drawn onto the various layers defined in the layers object, a key named "lines" must be present whose value must be an array of kinetic.js lines
         * @param {object} colour The key of this object named "value" must be the colour of the line that is to be drawn 
         * 
         * @description Creates the events listeners that watch for user interaction with the image then draw those onto the image
         * 
         */

        function start(stage, layers, objects, colour) {

            var layer,
                lines,
                image;

            if (layers.drawing) {

                layer = layers.drawing;
                lines = objects.lines;

            } else {

                layer = new Kinetic.Layer();
                layers.drawing = layer;
                stage.add(layer);
                lines = [];
                objects.lines = lines;


            }
            
            backup = layers.drawing.toJSON();

            


            image = objects.image;

            // Makes sure that when you touch the image it creates a new line each time and doesnt join to old ones
            image.on("mousedown touchstart", startDrawing)

            // While your finger is down this makes sure all the points are connected together as one line
            image.on('mousemove touchmove', continueDrawing)

            // Makes sure that if you finish your drawing with your finger off the image that it finishes that particular line
            stage.getContent().addEventListener('mouseup', finishOffImage, false);
            stage.getContent().addEventListener('touchend', finishOffImage, false);



            return



            ////////////////////////////////////////

            function startDrawing() {

                var touchPos = stage.getPointerPosition();
                var x = touchPos.x;
                var y = touchPos.y;
                var temp = new Kinetic.Line({
                    points: [x, y],
                    stroke: colour.value,
                    strokeWidth: 4,
                    lineCap: 'round',
                    lineJoin: 'round'
                });
                image.drawOn = true;
                lines.push(temp);

                layer.add(lines[lines.length - 1]);


            }

            function continueDrawing() {
                if (image.drawOn) {
                    var touchPos = stage.getPointerPosition();
                    var x = touchPos.x;
                    var y = touchPos.y;

                    lines[lines.length - 1].points(lines[lines.length - 1].points().concat([x, y]));
                    //console.log(myLine[myLine.length - 1].points());


                    layer.draw();
                }
            }

            function finishOffImage(evt) {
                image.drawOn = false;
                $rootScope.$apply();
            }





        }








        /**
         * @ngdoc method
         * @name stop 
         * @methodOf  camera.service:draw
         * @param {object} objects Contains objects that have been drawn onto the various layers defined in the layers object, a key named "image" must be present whose value must be a kinetic.js image
         * 
         * @description Removes the event listeners from a kineticjs image so that the imge no longer responds to touch/click.  Essentially this turns drawing mode off
         * 
         */
        function stop(objects) {

            objects.image.off("mousedown touchstart mousemove touchmove");

            return

        }




        /**
         * @ngdoc method
         * @name undo 
         * @methodOf camera.service:draw
         *@param {object} stage Kinetic.js stage object where the drawing layer is
         * @param {object} layers Contains layers that have kinetic.js objects on them, a key named "drawing" must be present whose value must be a kinetic.js layer
         * @param {object} objects Contains objects that have been drawn onto the various layers defined in the layers object, a key named "lines" must be present whose value must be an array of kinetic.js lines
         * @param {bool} all Boolean to determine whether to undo all the line or just the previous one 
         * 
         * @description Undoes lines that have been drawn.
         * 
         */
        function undo(stage, layers, objects, all) {
            
            all = all ? all : false;

            var layer = layers.drawing,
                lines = objects.lines;



            if (lines.length) {
                if(all){
                    layer.destroy();
                    delete layers.drawing;
                    delete objects.lines;
                    
                    var layerDraw = Kinetic.Node.create(backup);

                    objects.lines = [];
                    angular.forEach(layerDraw.children, function (line, key) {

                        objects.lines.push(line);

                    });


                    layers.drawing = layerDraw;

                    stage.add(layerDraw);

                    layerDraw.draw();
                }
                else{
                lines.pop().destroy();
                    layer.draw();
                }
                


            }



        }





    }









})();
(function () {

     angular
            .module("sqd")
            .controller("SearchController",SearchController)

    SearchController.$inject = ["$rootScope","$scope",'$ionicScrollDelegate', '$ionicLoading', '$ionicPopup', 'googleImages'];


    function SearchController($rootScope,$scope,$ionicScrollDelegate, $ionicLoading, $ionicPopup, googleImages){

        var self = this;

        self.image={};
        self.index=1;
        self.query = "";
        self.previousQuery="";
        self.thumbs = [];
        self.keyboardUp = false;
        
        self.submitSearch = submitSearch;
        self.searchChanged = searchChanged;
        self.imageSelect = imageSelect;
        
         window.addEventListener('native.keyboardshow', function() {

    self.keyboardUp = true;
                         
  });
        
         window.addEventListener('native.keyboardhide', function() {
           
             
    self.keyboardUp = false;
             
  });
        
        ////////////////////
        
        
        function submitSearch(){
            
            if(self.searchForm.$valid){
           
            $ionicLoading.show();
            
            self.thumbs = searchChanged() ? [] : self.thumbs;
            
            self.previousQuery = self.query;
        
            googleImages.read(self.query, self.index).then(function(data){
            self.index = data.nextPageIndex;
                self.thumbs = self.thumbs ? data.results.concat(self.thumbs) : data.results;
            $ionicLoading.hide(); $ionicScrollDelegate.scrollTop(true);
                $ionicScrollDelegate.resize();
                
            });
            }
            
            else{
             $ionicPopup.alert({
     title: "Empty search field",
                 okType: "button-assertive"
   });
            }
        
        }



        function imageSelect(item) {

              var img = {
                  thumb: item.thumb,
                  url: item.url,
                  from: 'link',
                  type: 'image'
              };



              self.select({
                  id: self.id,
                  img: img
              });


          }
        
        function searchChanged(){
        
        return !(self.query == self.previousQuery);
        
        }

          this.back = function(){
              this.clear();
              $scope.search.sqdInput.query.data="";
              $scope.search.changed = false;
          $scope.toggle = false;
          }

          this.clear = function(){
                  $scope.search.thumbs = [];
        $scope.search.startIndex=1;

         $scope.search.query = {
                         key: "AIzaSyDuQkoOtI820lE9iKEvzyyGvYfRa-z2MFE",
                        cx:" 004657510724817787166:jk7v1d__46y",
                        q:"",
              searchType:"image"
                }
          }

$rootScope.$on("input-cleared",function(event,args){

    if (args.label=="query"){
/*        $scope.search.thumbs = [];
        $scope.search.startIndex=1;

         $scope.search.query = {
                        key: "AIzaSyDuQkoOtI820lE9iKEvzyyGvYfRa-z2MFE",
                        cx:"004657510724817787166:jk7v1d__46y",
                        q:"",
              searchType:"image"
                }*/
        $scope.search.changed = true;


    }

})

$rootScope.$on("input-changed",function(event,args){

    if (args.label=="query"){
/*        $scope.search.thumbs = [];
        $scope.search.startIndex=1;

         $scope.search.query = {
                        key: "AIzaSyDuQkoOtI820lE9iKEvzyyGvYfRa-z2MFE",
                        cx:"004657510724817787166:jk7v1d__46y",
                        q:"",
              searchType:"image"
                }*/

         $scope.search.changed = true;


    }

})

                 $scope.$on("hide-errors",function(){
                    $scope.search.empty=false;
                    });



        }





})();
(function () {

    angular
        .module("sqd")
        .directive("search", search);

    search.$inject = ['$timeout'];

               /**
         * @ngdoc directive
         * @name sqd.directive:search
         * @restrict E
         * @scope
         * @param {string} id Unique id for this search element
         * @param {function} select reference to a funcion on the parent scope that handles an image selected from the search list. Takes arguments (id,img), where img is an object of the form { thumb: [thumbnail link],  url: [full image link], from: 'link',type: 'image'}
         * @param {function} hide reference to a function on the parents scope to be called to hide the modal view
         * @description
         * Creates an interfae to searach images from the internet
         */

    function search($timeout) {
        return{
             restrict: "E",
            scope:{},
            bindToController: {
                id:"@",
                select:"&",
                hide:"&",
                active:"="
            },
             templateUrl: 'app/components/search/search.html',
            controller: "SearchController",
            controllerAs: "search",
            link: link

    }


        /////////////////////////////////

                   function link(scope, element, attrs) {

                  scope.$on('modal.shown', function(event, modal) {

            if(modal.id=="search" && scope.search.active){

                 $timeout( function(){

                    angular.element(element).find('input')[0].focus();
                      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.show();
        }

      }, 500);



            }
    });


           }


    }

})();

(function () {

    angular
        .module("sqd")
        .directive("fullScreenText", fullScreenText);

    fullScreenText.$inject = ['$timeout'];

                   /**
         * @ngdoc directive
         * @name sqd.directive:fullScreenText
         * @restrict E
         * @scope
         * @param {string} id Unique id for this full screen text element
         * @param {function} hide reference to a function on the parents scope to be called to hide the modal view
        * @param {bool} active A boolean to determine if this full screen text view is currently active
        * @param {object/string} data Will hold all the data associated with the input, i.e. text any media.  Use object if you want to use fullScreenText with check-for-links directive, otherwise you can just use a string
        * @param {string} placeholder Placeholder for the textarea
        * @param {object} form Form element that this fullScreenText belongs to
        * @param {bool} links If true the content of the fullScreenText is checked to see if it contains links, the content of which is then attached to the media key of the data object (obviously data must be an object and not a string in this case)
        * @param {string} sqd-required Specifies if the textarea is a required part of the form (if indeed this fullScreenText is part of a form)
         * @param {bool} valid Is the fullScreenText valid or not
         * @description
         * Creates an interface to edit text in full screen mode
         */

    function fullScreenText($timeout) {

        return{
             restrict: "E",
            scope:{},
            bindToController: {
                id:"@",
                hide:"&",
                active:"=",
                data:"=",
                placeholder:"@",
                form:"=",
                links:"@",
                sqdRequired:"@",
                valid:"="
            },
             templateUrl: 'app/components/fullScreenText/fullScreenText.html',
            controller: "FullScreenTextController",
            controllerAs: "fullScreenText",
            link:link

    }


        ////////////////////////////

           function link(scope, element, attrs) {

                  scope.$on('modal.shown', function(event, modal) {

            if(modal.id=="fullScreenText" && scope.fullScreenText.active){

                 $timeout( function(){

                    angular.element(element).find('textarea')[0].focus();
                      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.show();

        }

        scope.fullScreenText.tapBlock = false;

      }, 500);



            }
    });


           }


    }

})();

(function () {

     angular
            .module("sqd")
            .controller("FullScreenTextController",FullScreenTextController)

    FullScreenTextController.$inject = ["$rootScope", "$scope", "$ionicPopup",'$timeout'];


    function FullScreenTextController($rootScope, $scope, $ionicPopup,$timeout){

        var self = this;

        self.tapBlock = true;
        self.maxCharacters = 139;
        self.adjustForIos = ionic.Platform.isIOS() ? {top:'20px'}:{};

        self.charactersRemaining = charactersRemaining;
        self.done =  done;



        ////////////////////

        function charactersRemaining(){

            //var text = typeof self.data === 'object' ? self.data.text : data;
            var text = self.form[self.id].$viewValue;
            var remaining = self.maxCharacters - text.length;


            return remaining

        }

        function done(){

            if(self.form[self.id].$error.maxlength){


                        $ionicPopup.alert({
     title: "Too many characters"
   });
            }
            else{

              self.tapBlock = true;


                  self.hide({
                    id: self.id
                    });

/*           $timeout( function(){

                    self.hide({
                    id: self.id
                    });

                 }, 300);*/

            }




        }




        }





})();

(function () {
    'use strict';
    angular
        .module('sqd')
        .provider('users', usersProvider);

    usersProvider.$inject = [];

    function usersProvider() {

        var api;
        
        usersService.$inject = ['$q', 'resources', 'exceptions'];

        var provider = {

            setApi: setApi,
            $get: usersService


        };

        return provider;


        ////////////////////////////////////////

        function setApi(url) {

           api = url;

        }


        
   /**
         * @ngdoc service
         * @name sqd.service:users
         * @param {object} $q Angular promise service
         * @param {object} resources Service to communicate with backend resources
          * @param {object} exceptions Service to catch a failed promise
         * @returns {object} Service object exposing methods - create, read, update
         *
         * @description
         * This is a service that is returned as part of usersProvider. Used to create, read and update a user's account details. Users can only use this service on their own accounts
         */
        
        function usersService($q, resources, exceptions) {

        var service = {

            create: create,
            read: read,
            update: update

        };

        return service;



        ////////////////////////////////////////


        /**
         * @ngdoc method
         * @name create 
         * @methodOf  sqd.service:users
         * @param {object} data {username:string, email:string, password:string}
         * @returns {promise} Resolves to an object with keys: username, email, verified if user details were successfully read, otherwise the promise is rejected. You must be the user in question to access this data
         * 
         * @description Retrives the private user account information for a specific user 
         * @example
         * <pre>users.read('joblogs')</pre>
         * 
         */

        function create(data) {

            var deferred = $q.defer();

            resources.create('user', api, data).then(postProcess).catch (exceptions.create('Problem creating user', deferred));

            return deferred.promise;

            ////////////////////////////////////////

            function postProcess(response) {

                deferred.resolve(response);

                return $q.when(response);

            }

        }
            
            
            
            
             /**
         * @ngdoc method
         * @name read 
         * @methodOf  sqd.service:users
         * @param {string} username Username
         * @returns {promise} Resolves to an object with keys: username, email, verified if user details were successfully read, otherwise the promise is rejected. You must be the user in question to access this data
         * 
         * @description Retrives the private user account information for a specific user 
         * @example
         * <pre>users.read('joblogs')</pre>
         * 
         */

        function read(userName) {

            var deferred = $q.defer();

             resources.read('user', api, userName).then(postProcess).catch (exceptions.create('Problem reading user', deferred));


            return deferred.promise;

            ////////////////////////////////////////

            function postProcess(response) {

                deferred.resolve(response);

                return $q.when(response);



            }



        }


        function update(userName,data) {


            var deferred = $q.defer();

            resources.update('user', api, userName, data).then(postProcess).catch(exceptions.create('Problem updating user', deferred));

            return deferred.promise;


            ////////////////////////////////////////

            function postProcess(response) {

                deferred.resolve(response);

                return $q.when(response);



            }




        }






    }



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
        
     squidlesService.$inject = ['$q', '$rootScope', 'resources', 'files','stores', 'profiles', 'exceptions'];

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
         * @returns {object} Service object exposing methods - create, read, update
         *
         * @description
         * This is a service that is returned as part of squidlesProvider. Used to create, read and updates squidles
         */

        function squidlesService($q, $rootScope, resources, files, stores, profiles, exceptions) {

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
         * @methodOf sqd.service:squidles
         * @param {object} squidle Object containing all the squidle data. Main keys: challenge, prize, answer. Sub keys: text photo, video.  Each Sub key must have at least a value key. Answer can only have a text key (see backend api for more details)
         *
         * @returns {promise} Resolves to an object that contains all the original squidle data in adition to the following keys: short, op, expires_at (see backend squidles api for more details), if the squidle is successfully created, otherwise the promise is rejected. Note, photo values must either be urls from the web or base64 dataURIs which will be converted to jpeg and uploaded to the squidler server
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

            function create(squidle) {

                var deferred = $q.defer();

                $q.all([processAnswer(squidle), processFiles(squidle)]).then(createSquidle).catch(exceptions.create('Problem creating your Squidle',deferred));

                return deferred.promise;

                ////////////////////////////////////////

                function processAnswer(squidle){

                    var A = squidle.answer.text.value.trim()
                    
                    // dots
                    // var H = A.replace(/[a-zA-Z0-9áéíÍóÓäÁëÉöÓúÚàèììùåÅÄÖ]/g, "\u2022");
                    
                    // box
                    // var H = A.replace(/[a-zA-Z0-9áéíÍóÓäÁëÉöÓúÚàèììùåÅÄÖ]/g, "\u2610");
                    
                    // Underscore
                     var H = A.replace(/[a-zA-Z0-9áéíÍóÓäÁëÉöÓúÚàèììùåÅÄÖ]/g, "\u005F ");
                    
                    // Underscore
                   var H = A.replace(/\S/gi, "\u005F ");
                    

                    
                    A = A.replace(/ /g, "").toLowerCase();


                    squidle.answer.text.value = A;
                    squidle.answer.text.hint = H;



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

          stores.remove('preview','squidle');                     stores.create('preview','squidle',{});
                        
                  stores.remove('tempSquidle','prize');
                  stores.create('tempSquidle','prize',{text:""});
                        stores.remove('tempSquidle','challenge');
        stores.create('tempSquidle','challenge',{text:""});
                        stores.remove('tempSquidle','answer');
        stores.create('tempSquidle','answer',{text:""});
                        
                         return profiles.read(squidle.op).then(function(opProfile){
      
                                squidle.op = username;
                        
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
         * @returns {promise} Resolves to an object that contains the following keys: challenge, answer (only the hints), short, op, expires_at.  If a guess is provided and is correct the object contains a prize and short keys. If the squidle cannot be read or the answer provided is incorrect the promise is rejected. (see backend squidles api for more details). If no squidle is presented then all stored squidles will be returnd as an object whose keys are the shortlink
         * @example
         * <pre>squidles.read({short:'VJ08tg6', guess:'blue'})</pre>
         *
         * 
         */


            function read(squidle) {

                
                var deferred = $q.defer();
                
                if(squidle){

                if(squidle.guess){processGuess(squidle).then(tryToGetPrize).catch(exceptions.create('Problem getting your prize',deferred));}

                else{getSquidle(squidle).catch(exceptions.create('Problem getting your Squidle',deferred));}
                }
                else{
                    
                    getAllSquidles().catch(exceptions.create('Problem getting your Squidles',deferred));
                }

                return deferred.promise;

                ////////////////////////////////////////

                function processGuess(squidle){
                    squidle.guess =  squidle.guess.toLowerCase().replace(/ /g, '');

                    return $q.when(squidle);
                }

                function tryToGetPrize(squidle) {

                    return resources.read('squidle', api, squidle.short, {answer: squidle.guess}).then(postProcess,wrongAnswer);

                    ////////////////////////////////////////

                    function postProcess(squidle) {

                        var id = squidle.short;

                        stores.update('squidles', id, squidle);

                        deferred.resolve(squidle);

                        return $q.when(squidle);

                    }
                    
                    function wrongAnswer(response){
                        
                        if(response.message=="Wrong answer"){
                    
                        deferred.resolve(response);
                        return $q.when();
                        }
                        else{
                            
                        deferred.reject();
                        return $q.when();
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


                    var id = squidle.short,
                            sent = squidle.sent ? squidle.sent : false;
                    
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
                        
                        
                         squidle.sent = sent;
                        
                        return $q.when(squidle);

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
         * @param {object} squidle Object containing the squidle data to be updated. This must include a "short" key to identify the squidle to be updated. To update hint an "answer" and "hintOn" key must be present, hintOn = true sets hints to be consistent with  answer.text.value, hintOn=false removes the hint altogether. To update expiry an "expires_at" key must be present with sub keys: interval (e.g. 'hour', 'day', 'week') and units (integer)
          * @param {string} field Name of the part of the squidle to be updated, currently only 'expiry' or 'hint'
         *
         * @returns {promise} Resolves to an object that contains the following keys: challenge, answer, short, op, expires_at, if the squidle was updated successfuly, oterwise the promise is rejected. (see backend squidles api for more details)
         * 
         * @description Updates a Squidle
         * @example
         * <pre>squidles.update({
         * short:VJ08tg6, 
         *hintOn:true, 
         *answer:{
         *text:{
         *value:'blue',
         *hint:••••}}})</pre>
         *
         * 
         */



            function update(squidle,field) {

                var deferred = $q.defer();

                switch (field.toLowerCase()) {
                case 'expiry':
                    processExpiry(squidle).then(updateSquidle).catch(exceptions.create('Problem updating your Squidle',deferred));
                    break;
                case 'hint':
                    processAnswer(squidle).then(updateSquidle).catch(exceptions.create('Problem updating your Squidle',deferred));
                    break;
                default:
                    break;
                }

                return deferred.promise;

                ////////////////////////////////////////

                function processExpiry(squidle){

                    var interval = squidle.expires_at.interval,
                        units = squidle.expires_at.units;

                    squidle.expires_at = createDate(interval, units);


                    return $q.when(squidle);

                ////////////////////////////////////////

                    function createDate(interval, units) {
                        var d = new Date();
                   
                        switch (interval.toLowerCase()) {
                        case 'year':
                            d.setFullYear(d.getFullYear() + units);
                            d = d.toISOString();
                            break;
                        case 'quarter':
                            d.setMonth(d.getMonth() + 3 * units);
                            d.toISOString();
                            break;
                        case 'month':
                            d.setMonth(d.getMonth() + units);
                            d = d.toISOString();
                            break;
                        case 'week':
                            d.setDate(d.getDate() + 7 * units);
                            d = d.toISOString();
                            break;
                        case 'day':
                            d.setDate(d.getDate() + units);
                            d = d.toISOString();
                            break;
                        case 'hour':
                            d.setTime(d.getTime() + units * 3600000);
                            d = d.toISOString();
                            break;
                        case 'minute':
                            d.setTime(d.getTime() + units * 60000);
                            d = d.toISOString();
                            break;
                        case 'second':
                            d.setTime(d.getTime() + units * 1000);
                            d = d.toISOString();
                            break

                        case 'none':
                            d.setFullYear(d.getFullYear() + units);
                            d = d.toISOString();
                            break

                        case 'once':
                            d = "once";
                            break

                        default:
                            d = undefined;
                            break;
                        }

                        return d
                    }


                }
                
               function processAnswer(squidle){
                   
               
                           
                       
                                               var A = squidle.answer.text.value.trim().replace(/ /g, "").toLowerCase();
                    // dots
                   // var H = A.replace(/[a-zA-Z0-9áéíÍóÓäÁëÉöÓúÚàèììùåÅÄÖ]/g, "\u2022");
                   
                   //box
                   // var H = A.replace(/[a-zA-Z0-9áéíÍóÓäÁëÉöÓúÚàèììùåÅÄÖ]/g, "\u2610");
                   
                   // Underscore
                   //var H = A.replace(/[a-zA-Z0-9áéíÍóÓäÁëÉöÓúÚàèììùåÅÄÖ]/g, "\u005F ");
                   
                   // Underscore
                   var H = A.replace(/\S/gi, "\u005F ");


                   if (squidle.hintOn){

                    squidle.answer = {text:{
                    value:A,
                        hint:H
                    }};
                           }
                           
                           else{
                               
                   squidle.answer = {text:{
                    value:A,
                        hint:""
                    }};
                           }
                           
                           

                           return $q.when(squidle);
                           







                    
                }


                function updateSquidle(squidle){



                    var id = squidle.short;
                    delete squidle.short;
                    delete squidle.hintOn;
                    

                     return resources.update('squidle',api,id,squidle).then(postProcess);

                    ////////////////////////////////////////

                    function postProcess(squidle){
                        
                        delete squidle.prize;

                        stores.update('squidles',id,squidle)
  deferred.resolve(squidle);
                        return $q.when(squidle);

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
            
            
            function remove(squidle){
                
                var deferred = $q.defer(),    
                  id = squidle.id,
                    sent = squidle.sent;
                    if(id){
                        
                         
                        return removeFromServer(id,sent).then(removeFromPhone);                        

                        
                    }
                    else{

                    return $q.reject('No squidle id presented')
                    }
                
                
                
                deferred.resolve();
                
                return deferred.promise;

                ////////////////////////////////////////
                
                function removeFromServer(id,sent){
                
                    
                    return $q.when(id);
                    
                    
                }
                
                function removeFromPhone(id){
                    

                    return stores.remove('squidles', id)
                    
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
            update: update

        };

        return service;



        ////////////////////////////////////////


                    /**
         * @ngdoc method
         * @name create 
         * @methodOf sqd.service:resources
         * @param {string} name Primary key used for encoding the  JSON data sent to backend and for reading the response data, e.g. 'squidles'
         * @param {string} api URL of the backend api for the  resource described by 'name', e.g. '/api/v1/squidles'
         * @param {object} data Data object specific to the backend resource, see http://#/api/backend_resource_list
         * @param {object=} options {formData:bool} 
         * @returns {promise} Resolves to an object specific to the backend resource if the resource was created successfully.  Otherwise the promise is rejected with an object of the form {message:string, code:int}

         * 
         * @description Creates a resource on the backend, using a POST method. This takes a minimum time set in the config of resourcesProvider using the method setWaitTime
         * @example
         * <pre>resources.create('squidle','http://squidler.com/api/v1/squidles', {...squidle data...})</pre>
         *
         * 
         */

        function create(name, api, data, options, silent) {

            var deferred = $q.defer(),
                startTime = new Date().getTime(),
                namedData = {},
                config = {},
                silent = silent ? silent : false;

                if(options||{}.formData){
                     config = {transformRequest: angular.identity,headers: {'Content-Type': undefined}};

                    namedData = new FormData();
                    namedData.append(name, data);
                }

                else{
                    namedData[name] = data;

                }
            
         try {
             $ionicPlatform.ready(function () {
                 


                 if ($cordovaNetwork.isOffline()) {

                     exceptions.create('No internet connection', deferred, 'No internet connection',silent)('No internet connection');
                 } else {
                     $http.post(api, namedData, config).then(processResponse).catch(exceptions.create('Cannot create ' + name + ' on the server', deferred, 'resources.create fail',silent));
                 }


             });
         } catch(err) {
             
             
             $http.post(api, namedData, config).then(processResponse).catch(exceptions.create('Cannot create ' + name + ' on the server', deferred, 'resources.create fail',silent));
         }








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
                            deferred.reject(response.data.errors)
                        }
                    }, waitTime - responseTime);
                } else {
                                           if(response.data.success){
                        deferred.resolve(response.data[name]);}
                        else{
                            deferred.reject(response.data.errors)
                        }
                }

            }





        }


                    /**
         * @ngdoc method
         * @name read 
         * @methodOf sqd.service:resources
         * @param {string} name Primary key used for reading the response data from the backend, e.g. 'squidles'
         * @param {string} api URL of the backend api for the  resource described by 'name', e.g. '/api/v1/squidles'
         * @param {string} id Used to uniquely identify the requested resource, e.g. '8KLv694'
         * @param {object=} params Extra information specific to the backend resource, e.g. {guess:blue} for trying to get the Squidle prize, see http://#/api/backend_resource_list
         * @returns {promise} Resolves to an object specific to the backend resource if the resource was read successfully.  Otherwise the promise is rejected with an object of the form {message:string, code:int}

         * 
         * @description Reads a resource on the backend, using a GET method. This takes a minimum time set in the config of resourcesProvider using the method setWaitTime
         * @example
         * <pre>resources.read('history', 'http://squidler.com/api/v1/history', 'joblogs')</pre>
         *
         * 
         */
            
        function read(name, api, id, params, silent) {

            var deferred = $q.defer(),
                startTime = new Date().getTime(),
                p = {
                    params: params
                },
                silent = silent ? silent : false;
            
        
     try {
         $ionicPlatform.ready(function () {

             if ($cordovaNetwork.isOffline()) {

                 exceptions.create('No internet connection', deferred, 'No internet connection',silent)('No internet connection');
             } else {
                 $http.get(api + "/" + id, p).then(processResponse).catch(exceptions.create('Cannot find ' + name + ' on the server', deferred, 'resources.read fail',silent));
             }


         });
     } catch(err) {
         
         $http.get(api + "/" + id, p).then(processResponse).catch(exceptions.create('Cannot find ' + name + ' on the server', deferred, 'resources.read fail',silent));
     }

            

            return deferred.promise;

            ////////////////////////////////////////

            function processResponse(response) {

                var responseTime = new Date().getTime() - startTime;

                if (responseTime <= waitTime) {
                    $timeout(function () {
                        if(response.data.success){
                        deferred.resolve(response.data[name]);}
                        else{
                            deferred.reject(response.data.errors)
                        }
                    }, waitTime - responseTime);
                } else {
                                           if(response.data.success){
                        deferred.resolve(response.data[name]);}
                        else{
                            deferred.reject(response.data.errors)
                        }
                }

            }



        }

/**
         * @ngdoc method
         * @name update 
         * @methodOf sqd.service:resources
         * @param {string} name Primary key used for reading the response data from the backend, e.g. 'squidles'
         * @param {string} api URL of the backend api for the  resource described by 'name', e.g. '/api/v1/squidles'
         * @param {string} id Used to uniquely identify the requested resource, e.g. '8KLv694'
         * @param {object} data Data object specific to the backend resource, see http://#/api/backend_resource_list
         * @returns {promise} Resolves to an object specific to the backend resource if the resource was updated successfully.  Otherwise the promise is rejected with an object of the form {message:string, code:int}

         * 
         * @description Updates a resource on the backend, using a POST method wth parameter _method = put. This takes a minimum time set in the config of resourcesProvider using the method setWaitTime
         * @example
         * <pre>resources.update('profile', 'http://squidler.com/api/v1/profiles', 'joblogs', {...profile data...})</pre>
         *
         * 
         */
            
        function update(name, api, id, data, silent) {

            var deferred = $q.defer(),
                startTime = new Date().getTime(),
                namedData = {},
                silent = silent ? silent : false;

            namedData[name] = data;
            
            try {
                $ionicPlatform.ready(function () {

                    if ($cordovaNetwork.isOffline()) {

                        exceptions.create('No internet connection', deferred, 'No internet connection',silent)('No internet connection');
                    } else {
                        $http.post(api + "/" + id + "?_method=put", namedData).then(processResponse).catch(exceptions.create('Cannot update ' + name + ' on the server', deferred, 'resources.update fail', silent));
                    }


                });
            } catch(err) {
                
                $http.post(api + "/" + id + "?_method=put", namedData).then(processResponse).catch(exceptions.create('Cannot update ' + name + ' on the server', deferred, 'resources.update fail', silent));
            }


            return deferred.promise;

            ////////////////////////////////////////

            function processResponse(response) {

                var responseTime = new Date().getTime() - startTime;

                if (responseTime <= waitTime) {
                    $timeout(function () {
                        if(response.data.success){
                        deferred.resolve(response.data[name]);}
                        else{
                            deferred.reject(response.data.errors)
                        }
                    }, waitTime - responseTime);
                } else {
                                           if(response.data.success){
                        deferred.resolve(response.data[name]);}
                        else{
                            deferred.reject(response.data.errors)
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

            function create(files) {

                var deferred = $q.defer();

                processFiles(files).then(uploadFiles).catch(exceptions.create('Problem processing your files', deferred, 'files.create error'));

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

        function create(name, id, data) {


            var deferred = $q.defer();

            try{

            $localStorage[name] = $localStorage[name] ? $localStorage[name] : {};

           if(id) {$localStorage[name][id] = $localStorage[name][id] ? $localStorage[name][id] : data;}

            deferred.resolve(name + " with id= " + id + " successfully saved to local storage");}

            catch(error){
                        exceptions.create('Cannot store ' + name + ' with id ' + id, deferred, 'stores.create error')(error);
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


        function read(name, id) {

            var deferred = $q.defer(),
                store,
                storeCopy;
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


        function update(name, id, data) {

           var deferred = $q.defer();

            try {
                var store = $localStorage[name][id];
                if (store) {
               angular.forEach(data, function(value, key){
                    store[key] = value;
               });
               deferred.resolve(store);
           }
                else{
                    throw 'NA'
                }

            }
            catch(error){exceptions.create('Cannot update ' + name + ' with id ' + id + '. Data not in storage', deferred, 'stores.update error')(error)}




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


        function remove(name, id, fields) {


           var deferred = $q.defer();
            
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
                }

            }
            catch(error){exceptions.create('Cannot delete entries from ' + name + ' with id ' + id + '. Data not in storage', deferred, 'stores.delte error')(error)}
                
            }
            
            else{
                localStorage.clear();
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
         * @param {object=} options If it contains the key "refreshAll" with value true then each entry of the history will be refreshed, otherwise only new squidles will be added
         * @returns {promise} Resolves to an array of squidle objects (see squidles.read for more details on the structure of those objects)
         *
         * @description Retrieves the Squidle history of a user
         * @example
         * <pre>history.read()</pre>
         *
         */

        function read(options) {


            var deferred = $q.defer();

           stores.read('users', 'current').then(getHistoryList).then(getAllItems).catch(exceptions.create('Problem getting your Squidles history', deferred, 'history.read error'));


            return deferred.promise;

            ////////////////////////////////////////

            function getHistoryList(username){


                return resources.read('history', api, username);

            }

            function getAllItems(list){
                var proms = [],
                     shorts = list.shorts,
                     actions = list.actions,
                     tempSquidles;

                if ((options||{}).refreshAll){
                    stores.read('squidles').then(function(squidles){
                      tempSquidles = squidles;
                      stores.remove('squidles');
                    });

                }

                if(shorts){



                    for(var i=0;i<shorts.length;i++){

                        var squidle = {
                            short: shorts[i],
                            sent: actions[i]=="sent" ? true:false

                        };

                        proms.push(squidles.read(squidle));

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

                function restoreOldSquidles(){
                  angular.forEach(tempSquidles,function(squidle,short){

                    stores.create('squidles',short,squidle);

                  });
                  return $q.reject();

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
(function () {
    'use strict';
    angular
        .module('sqd')
        .provider('googleImages', googleImagesProvider);

    googleImagesProvider.$inject = [];

    function googleImagesProvider() {

        var cred,
            api;
        
        googleImagesService.$inject = ['$q', '$http', 'exceptions'];

        var provider = {

            setAuthCred: setAuthCred,
            setApi: setApi,
            $get: googleImagesService


        };

        return provider;


        ////////////////////////////////////////

        function setAuthCred(data) {

            cred = data;

        }

        function setApi(url) {

            api = url;

        }



        
            /**
         * @ngdoc service
         * @name sqd.service:googleImages
         * @param {object} $q Angular promise service
         * @param {object} $http Angular http service
          * @param {object} exceptions Service to catch a failed promise
         * @returns {object} Service object exposing methods - read
         *
         * @description
         * This is a service that is returned as part of googleImagesProvider. Used to search google images
         */

        function googleImagesService($q, $http, exceptions) {

            var service = {

                read: read

            };

            return service;



            ////////////////////////////////////////


        /**
         * @ngdoc method
         * @name read 
         * @methodOf  sqd.service:googleImages
         * @param {string} query What you are searching google images for
         * @param {integer} pageNum Which set of 10 results to show (1 = first set of 10, 2 = second set of 10)
         * @returns {promise} Resolves to an object of the form - {results: [{thumb:string, url:string, aspect:number}], nextPageIndex: integer} -  if search was successfully performed, otherwise the promise is rejected.
         * 
         * @description Queries google images and returns 10 results at a time 
         * @example
         * <pre>googleImages.read('chicken',1)</pre>
         * 
         */

            function read(query, pageNum) {
              

                var deferred = $q.defer(),
                    data;

                data = {
                    key: cred.key,
                    cx: cred.cx,
                    q: query,
                    searchType: "image"
                }

                if (pageNum) {
                    data.start = pageNum;
                };

                $http.get(api, {params: data}).then(processResponse).catch(exceptions.create('Problem with Google Images', deferred, 'googleImages.read error'));


                return deferred.promise;

                ////////////////////////////////////////

                function processResponse(response) {

                    var list = response.data.items,
                        nextPageIndex = response.data.queries.nextPage[0].startIndex,
                        results = [];

                  list.forEach(function (element, index) {

                      results[index] = {
                        thumb: element.image.thumbnailLink,
                        url: element.link,
                        aspect: element.image.width / element.image.height
                    };

                    });


                    deferred.resolve({
                        results: results,
                        nextPageIndex: nextPageIndex

                    });

                    return $q.when({
                        results: results,
                        nextPageIndex: nextPageIndex

                    });



                }





            }





        }



    }



})();
(function () {
    'use strict';
    angular
        .module('sqd')
        .factory('links', links);

    links.$inject = ['$q', '$http', 'youtube', 'imgur', 'exceptions'];
    
     /**
         * @ngdoc service
         * @name sqd.service:links
         * @param {object} $q Angular promise service
         * @param {object} $http Angular http service
         * @param {object} youtube Service to extract video information from a youtube link
         * @param {object} imgur Service to extract image information from an imgur link
          * @param {object} exceptions Service to catch a failed promise
         * @returns {object} Service object exposing methods - read
         *
         * @description
         * This is a service used to extract image or video imformation from a link contained within some input text
         */



    function links($q, $http, youtube, imgur, exceptions) {


        var service = {

            read: read

        };

        return service;

        


        ////////////////////////////////////////
                        /**
         * @ngdoc method
         * @name read 
         * @methodOf  sqd.service:links
         * @param {string} text Any piece of text
         * @returns {promise} Resolves to an object of the form - {text: string, data: object}. Data is an object of the form {thumb: string, type: string, url: string} provided by a data service such as imgur or youtube (if no url in the text the data key is not produced). Text is a string that contains the initial input text, either without any url if data can be extracted from it, otherwise the url is shortened.  If a url contained within the text cannot be processed the promise is rejected
         * 
         * @description Reads some text and processes the first link inside it, either by shortening it or extracting it and replacing it with the image/video information contained within it.
         * @example
         * <pre>link.read('OMG this is soooooo funny http://imgur.com/gallery/whrgItd')</pre>
         * 
         */


        function read(text) {

            var deferred = $q.defer(),
                words = text.split(" "),
                linkCheck = ['http', 'www'],

              linkDataCheck = {
                    image: {
                        list:['.jpg', '.jpeg', '.png', '.gif', '.gifv'],
                    getData:function(url){
                        
                        var urlSplit = url.split("."),
                            ext = urlSplit.pop();
                        
                        if(ext=="gifv"){
                            urlSplit.push("gif");
                            url = urlSplit.join(".");
                            
                        }
                        
    
                           return $q.when({
                            thumb: url,
                            type: 'image',
                            url: url
                        });
                        }},
                    youtube: {
                        list:['youtube.com', 'youtu.be'],
                        getData: function(url){
                            return youtube.read(url);
                        }},
                    imgur: {
                        list: ['imgur'],
                        getData:function(url){
                            return imgur.read(url);
                        }}

                };



            hasLink(words).then(processLink, doNothing).catch(exceptions.create('Problem processing your link', deferred));


            return deferred.promise;


            ////////////////////////////////////////

            function hasLink(words) {

                for (var i = 0; i < words.length; i++) {


                    var bool = linkCheck.some(function (element) {

                        return words[i].toLowerCase().indexOf(element) != -1;

                    });

                    if (bool) {

                        return $q.when({
                            words: words,
                            link: words[i],
                            linkIndex: i
                        });

                    }

                }

                if (!bool) {
                    return $q.reject({
                        words: words
                    });
                }


            }

            function processLink(data) {

                return hasLinkData(data).then(getLinkData, shortenLink);

                ////////////////////////////////////////

                function hasLinkData(data) {

                    var link = data.link,
                        bool,
                        value;

                   for(var key in linkDataCheck) {
                       value = linkDataCheck[key].list;

                        for (var i = 0; i < value.length; i++) {

                       bool = link.toLowerCase().indexOf(value[i]) != -1;


                        if (bool) {

                            data.get = linkDataCheck[key].getData;

                            return $q.when(data);

                        }

                    }


};


                    if (!bool) {
                         return $q.reject(data);
                         }

                    return

                }

                function getLinkData(data) {

                    var words = data.words,
                        index = data.linkIndex;

                   return data.get(data.link).then(postProcess).catch(problemGettingData);


                    ////////////////////////////////////////

                    function postProcess(data) {

                        var text;

                        words[index] = '';

                        text = words.join(' ');

                        deferred.resolve({
                            text: text,
                            data: data
                        });

                        return $q.when({
                            text: text,
                            data: data
                        });


                    }
                    
                    function problemGettingData(error){
                        
                        var text = words.join(' ');
                        
                          deferred.reject({text:text});
                        
                        return $q.reject({text:text})
                    
                    
                    }




                }

                function shortenLink(data) {


                    var api = 'https://www.googleapis.com/urlshortener/v1/url',
                        auth = {key:'AIzaSyCZn1W6SMErAw0QBbSr8pWuI1G1O4r4YUo'},
                        url = {longUrl:data.link},
                        words = data.words,
                        index = data.linkIndex;

                   return  $http.post(api, url, {params: auth}).then(postProcess).catch(problemWithShortener);

                    ////////////////////////////////////////

                    function postProcess(response){
                        var text;

                        words[index] = response.data.id;

                        text = words.join(' ');

                        deferred.resolve({text:text});

                        return $q.when({text:text});


                    }
                    
                    function problemWithShortener(error){
                    
                        deferred.reject({text:text});
                        
                        exceptions.create('Problem with Google link shortener')(error);
                    }



                }

            }



            function doNothing(words) {

                var text = words.words.join(' ');

                deferred.resolve({text:text});

                return $q.when({text:text});

            }





        }







    }









})();
(function () {
    'use strict';
    angular
        .module('sqd')
        .factory('youtube', youtube);

    youtube.$inject = ['$q', '$http', 'exceptions'];

    /**
         * @ngdoc service
         * @name sqd.service:youtube
         * @param {object} $q Angular promise service
         * @param {object} $http Angular http service
          * @param {object} exceptions Service to catch a failed promise
         * @returns {object} Service object exposing methods - read
         *
         * @description
         * This is a service used to extract video imformation from a youtube link, e.g, thumbnail and full video links
         */

    function youtube($q, $http, exceptions) {


        var service = {

            read: read

        };

        return service;



        ////////////////////////////////////////

           /**
         * @ngdoc method
         * @name read 
         * @methodOf  sqd.service:youtube
         * @param {string} url Url of Youtube video
         * @returns {promise} Resolves to an object of the form - {thumb: string, type: 'video', url: string} -  if url was successfully processed, otherwise the promise is rejected
         * 
         * @description Extracts video information from an Youtube link 
         * @example
         * <pre>imgur.read('https://www.youtube.com/watch?v=VfCeIKseyYA')</pre>
         * 
         */

        function read(url) {

             var deferred = $q.defer();


          extractIdFromUrl(url).then(getData).catch(exceptions.create('Problem processing your YouTube link',deferred,'youtube.read error'));

            return deferred.promise;


            ////////////////////////////////////////

            function extractIdFromUrl(url){

                var id,
                    QIndex;

                id = url.indexOf('youtube.com') != -1 ? getParameterByName('v', url) :  url.slice(url.lastIndexOf('/') + 1, url.length);

                QIndex = id.indexOf('?');

                id = QIndex != -1 ? id.slice(0, QIndex) : id;

                return id!="" ? $q.when(id) : $q.reject('Empty YouTube id');


                }

            function getParameterByName(name, text){

                name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                    results = regex.exec(text);

                return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));

            }

            function getData(id){

                var thumb = "http://img.youtube.com/vi/" + id + "/default.jpg",
                    url = "http://www.youtube.com/embed/" + id;

                deferred.resolve({
                            thumb: thumb,
                            type: 'video',
                            url: url
                        });

                      return $q.when({
                            thumb: thumb,
                            type: 'video',
                            url: url
                        });


            }









        }







    }









})();
(function () {
    'use strict';
    angular
        .module('sqd')
        .factory('imgur', imgur);

    imgur.$inject = ['$q', '$http', 'exceptions'];
    
     /**
         * @ngdoc service
         * @name sqd.service:imgur
         * @param {object} $q Angular promise service
         * @param {object} $http Angular http service
          * @param {object} exceptions Service to catch a failed promise
         * @returns {object} Service object exposing methods - read
         *
         * @description
         * This is a service used to extract image imformation from an imgur link, e.g, thumbnail and full image links
         */


    function imgur($q, $http, exceptions) {


        var service = {

            read: read

        };

        return service;



        ////////////////////////////////////////

                /**
         * @ngdoc method
         * @name read 
         * @methodOf  sqd.service:imgur
         * @param {string} url Url of Imgur page
         * @returns {promise} Resolves to an object of the form - {thumb: string, type: 'image', url: string} -  if url was successfully processed, otherwise the promise is rejected
         * 
         * @description Extracts image information from an Imgur link 
         * @example
         * <pre>youtube.read('http://imgur.com/gallery/whrgItd')</pre>
         * 
         */

        function read(url) {

             var deferred = $q.defer();


            extractIdFromUrl(url).then(getData).catch(exceptions.create('Problem processing your Imgur link',deferred,'imgur.read error'));

            return deferred.promise;


            ////////////////////////////////////////


            function extractIdFromUrl(url){

                var id;

                id = url.indexOf('#') != -1 ? url.slice(url.lastIndexOf('#') + 1, url.length) :  url.slice(url.lastIndexOf('/') + 1, url.length);

                return id!="" ? $q.when(id) : $q.reject('Empty Imgur id');


                }


            function getData(id){

                var thumb,
                    url;

                if(id.length >= 7){

                 thumb = "http://i.imgur.com/" + id + "t.jpg";
                  url ="http://i.imgur.com/" + id + ".jpg";

                 deferred.resolve({
                            thumb: thumb,
                            type: 'image',
                            url: url
                        });

                 return $q.when({
                            thumb: thumb,
                            type: 'image',
                            url: url
                        });
                }
                else{
                return $q.reject('Gallery id detected: you need to use a link to a single image')
                }


// IN ORDER TO ACCESS THE DETAILS OF AN IMGUR GALLERY TO PULL THE FIRST IMAGE ONLY WE NEED TO HAVE AN IMGUR ACCOUNT AND THEN PAY //
/*                  return $http.get("http://i.imgur.com/gallery/" + id + ".json").success(function (response){

                       id = "album_images" in response.data.image ? response.data.image.album_images.images[0].hash : response.data.image.hash;

                      thumb = "http://i.imgur.com/" + id + "t.jpg";
                      url ="http://i.imgur.com/" + id + ".jpg";

                      deferred.resolve({
                            thumb: thumb,
                            type: 'image',
                            url: url
                        });


                   }).catch(exceptions.create('Server communication error at Imgur'));*/


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
         * @returns {promise} Resolves to an object with keys: avatar, location, bio, first_name, last_name, twitter_username, github_username and google_plus_username if profile was successfully read, otherwise the promise is rejected. 
         * 
         * @description Retrives the public profile for a specific user or all profiles stored locally.
         * @example
         * <pre>profiles.read('joblogs')</pre>
         * 
         */

                function read(username,options) {


                     var refresh = (options||{}).refresh;
                    
                    if(refresh){
                    
      
                     return  stores.read('profiles',username).then(refreshProfiles).catch(exceptions.create('Problem reading all profiles'));
                            
                    }
                    else{
                                    
                    return stores.read('profiles',username).catch(fetchProfile).catch(exceptions.create('Problem reading profile'));
                    }


                    ////////////////////////////////////////
                    
                    
                    function fetchProfile(){
                    
                    return resources.read('profile', api, username).then(processResponse);
                        
                        //////////////////////
                        
                        function processResponse(data) {
                        
                        stores.create('profiles', username, data)


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
        * @returns {promise} Resolves to an object with keys: avatar, location, bio, first_name, last_name, twitter_username, github_username and google_plus_username if profile was successfully read, otherwise the promise is rejected. 
        *
         * @description Updates the public profile of a speciic user (need to be the user in question to do this) 
         * @example
         * <pre>profiles.read('joblogs',{bio:'Me me Me', location:'London'})</pre>
         * 
         */


                function update(username,profile) {

                    var deferred = $q.defer();

                    processAvatar(profile).then(updateProfile).catch(exceptions.create('Problem updating your profile', deferred));

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
                            
                return            stores.update('profiles',username,profile).then(function(){
                            deferred.resolve(response); $rootScope.$broadcast('profileUpdated');
                            });

                                            }





                    }






                }



            }
        }



})();
(function () {

    angular
        .module('sqd')
        .directive('unique', unique)

    unique.$inject = ['$q', 'users'];
    
       /**
         * @ngdoc directive
         * @name sqd.directive:unique
         * @restrict A
         * @element input
         *
         * @description
         * Username check. This creates an asyncValidator for the input which connects to the backend to check whether the text input matches an existing username.  If the username is already taken the validator will fail, i.e. Angular's formName.inputName.$errors object will be populated with a "unique" entry and formName.inputName.$invalid = true.  Use in conjunction with ngMessages
         */

    function unique($q, users) {

        var directive = {
            restrict: 'A',
            require: 'ngModel',
            link: link
        };

        return directive

        ////////////////////////////////////////

        function link(scope, element, attrs, ngModelCtrl) {

            ngModelCtrl.$asyncValidators.unique = function(modelValue){

                var deferred = $q.defer();

                users.read(modelValue).then(validateFalse,validateTrue);

                return deferred.promise

                ////////////////////////////////////////

                function validateTrue(){

                    deferred.resolve();

                }

                function validateFalse(){

                    deferred.reject();
                }

            }




        }

        }

    }
)();
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
(function () {

    angular
        .module('sqd')
        .directive('checkForLinks', checkForLinks)

    checkForLinks.$inject = ['$q', 'links', 'stores', 'exceptions'];

    /**
     * @ngdoc directive
     * @name sqd.directive:checkForLinks
     * @restrict A
     * @element sqd-input
     *
     * @description
     * Applied to a sqd-input element with "model" attribute set to be an object. It scans the text input to check for links inside.  If it finds a link it will remove it from the text and the attachable content from the link will be added to the "media" key of the "model" object on the scope of the sqd-input. If there is no image or video data it will replace the link with a google shortlink.  Uses link.service
     */

    function checkForLinks($q, links, stores, exceptions) {

        var directive = {
            restrict: 'A',
            require: 'ngModel',
            link: link
        };

        return directive

        ////////////////////////////////////////

        function link(scope, element, attrs, ngModelCrtl) {


            ngModelCrtl.$parsers.push(function (modelValue) {

                if (!scope.model.media) {


                    var deferred = $q.defer();

                    links.read(modelValue).then(updateModel).catch(doNothing);

                    return deferred.promise

                

                } else {

                    return modelValue
                }
                
                 ////////////////////////////////////////
                
                 function updateModel(data) {
                        if (data.data) {
                            data.data.from = "link";
                            var temp = {
                                text: data.text,
                                media: data.data
                            };
                            scope.model = temp;
                            scope.text = data.text;


                        } else {
                            scope.model = data;
                            scope.text = data.text;
                        }




                        deferred.resolve();

                    }
                
                function doNothing(data){
                            scope.model = data;
                            scope.text = data.text;
                }



            });




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
         * @param {obj} expires_at time/date object with keys 'date', 'timezone_type', 'timezone'
         * @returns {int} Seconds remaining
         * 
         * @description Calculates the number of seconds remaining before the squidle expires
         * @example
         * <pre>time.remaining({"date":"2015-12-04 21:27:40","timezone_type":3,"timezone":"UTC"})</pre>
         * 
         */
        

        
        function remaining(expires_at){
            
             var arr = expires_at.split(/[- :]/),
   exp_date = new Date(Date.UTC(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]));
            
            var timeRemaining = Math.round((exp_date-Date.now())/1000);
            
            return timeRemaining
            
        }
    




    }









})();
(function () {
    'use strict';
    angular
        .module('sqd')
        .provider('statistics', statisticsProvider);

    statisticsProvider.$inject = [];

    function statisticsProvider() {

        var api;
        
        statisticsService.$inject = ['$q', 'resources', 'stores', 'profiles'];

        var provider = {

            setApi: setApi,
            $get: statisticsService


        };

        return provider;


        ////////////////////////////////////////

        function setApi(url) {

            api = url;

        }



        
        
        /**
         * @ngdoc service
         * @name sqd.service:statistics
         * @param {object} $q Angular promise service
         * @param {object} resources Service to communicate with backend resources 
         * @param {object} stores Service used to interface with the html5 local storage
          * @param {object} profiles Retrives the public profile for a specific user 
         * @example
         *
         * @returns {object} Service object exposing methods - read
         *
         * @description
         * This is a service that is returned as part of statisticsProvider. Used to retrieve a statistics information on a particular Squidle
         */

        function statisticsService($q, resources, stores, profiles) {

        var service = {

            read: read

        };

        return service;



        ////////////////////////////////////////

        /**
         * @ngdoc method
         * @name read 
         * @methodOf  sqd.service:statistics
         * @param {string} short Short link id of the squidle
         * @returns {promise} Resolves to an object with keys 'summary' (summary stats on squidle) and 'players' (an array with player specific stats)
         * 
         * @description Retrieves the Squidle stats 
         * @example
         * <pre>statistics.read('F36SAb6')</pre>
         * 
         */

        function read(short) {
            
            var deferred = $q.defer();
            
            
            readFromServer().then(updateStats).catch(error);        
                          

            return deferred.promise;

            ////////////////////////////////////////
            
            function readFromServer(){
                
                var stats = {},
                    proms = [];
                
                stats.summary = {
                    
                    attempts:10,
                    solves:1
                    
                };
                
                stats.players = [
                    {username:'bieira',
                    attempts:6,
                    solved:true},
                    {username:'colourblock',
                    attempts:4,
                    solved:false}
                ];
                
                angular.forEach(stats.players, function(player, index){
                    
                    var username = player.username;
                    
                     proms.push(profiles.read(username));
                    
                    
                });
                
                                               
             
                
                return $q.all(proms).then(function(){
                    
                    return $q.when(stats);
                    
                });
                
                
                ////////////////////////////////////////
                
/*                function postProcess(profiles){
                    
                     angular.forEach(profiles, function(profile, index){
                    
                    stats.players[index].avatar = profile.avatar;
           
                         
                      
                    
                    
                });
                    
                    return $q.when(stats);
                    
                    
                }*/
                
                
                
            }
                
                
            
            function updateStats(stats){
                
                return stores.update('squidles',short,{stats:stats}).then(function(squidle){
                    
                    deferred.resolve(squidle);
                    
                });
                
            }
            
            function error(){
                
                deferred.reject();
                
                
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

        sqdInput.$inject = [];

        /**
         * @ngdoc directive
         * @name sqd.directive:sqdInput
         * @restrict E
         * @scope
         * @param {string} type Same a for html input element
         * @param {string} placeholder Same a for html input element
         * @param {string} name Same a for html input element
         * @param {string} required Same as for html input element
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
         *
         * @description
         * Creates an input/textarea with some UI elements to allow the user to e.g. delete all text and also see if input is valid. Also allows the input to be scanned for attachable content from the web
         */


        function sqdInput() {

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
                    nospaces:"@"
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
          if($scope.focus){
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
(function() {

    angular
      .module('sqd')
      .directive('restrictMinMax', restrictMinMax)

    restrictMinMax.$inject = [];

    /**
     * @ngdoc directive
     * @name sqd.directive:restrictMinMax
     * @restrict A
     * @element input
     *
     * @description
     * Use on number input with min and max attributes set. This directive will prevent users from using keyboard to write numbers outside the range.
     */


    function restrictMinMax() {

      var directive = {
        restrict: 'A',
        link: link,
        require: 'ngModel',
      };

      return directive

      ////////////////////////////////////////


      function link(scope, element, attrs, ngModel) {

        var min = attrs.min,
          max = attrs.max;


        ngModel.$parsers.push(function(value) {

          value = value > max ? max : (value < min ? min : value);
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
            .directive('sqdNumber', sqdNumber)

        sqdNumber.$inject = [];

        /**
         * @ngdoc directive
         * @name sqd.directive:sqdNumber
         * @restrict E
         * @scope 
         * @param {int} min Min value
         * @param {int} max Max value
         * @param {int} step Step size to increment number
         * @param {bool} disabled To tell the input that it cannot be changed
         * @param {int} model value of the model to go into ng-model on the input
         *
         * @description
         * Creates an number input with arrows above and below to increment
         */


        function sqdNumber() {

            var directive = {
                restrict: 'E',
                templateUrl: "app/shared/sqdNumber/sqdNumber.html",
                replace: true,
                scope: {
                    min: "@",
                    max:"@",
                    step:"@",
                    disabled:"@",
                    model:"="
                    
                },
                link: link,
                controller: "SqdNumberController"
            };

            return directive

            ////////////////////////////////////////


            function link(scope, element, attrs) {

  


            }

        }
    }


)();
(function () {

     angular
            .module("sqd")
 .controller("SqdNumberController",SqdNumberController)

    SqdNumberController.$inject = ["$scope"];


    function SqdNumberController($scope){
        
        var self = this;
        

            $scope.increase = increase;
        $scope.decrease = decrease;
        
        activate();
        



            
            ////////////////////////////////////////
        
        function activate(){
            
            self.max = parseInt($scope.max);
            self.min = parseInt($scope.min);
            self.step = parseInt($scope.step);
            
            
        }
        
         
        function increase(){
            
            $scope.model = ($scope.model+self.step) >= self.max ? self.max : $scope.model+self.step;

            
        }
        
                function decrease(){
            
            $scope.model = ($scope.model-self.step) <= self.min ? self.min : $scope.model-self.step;
            
        }
        




}


})();
(function () {

    angular
        .module('sqd')
        .directive('sqdAvatar', sqdAvatar)

    sqdAvatar.$inject = ['$q', 'links', 'stores', 'exceptions'];

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

    function sqdAvatar($q, links, stores, exceptions) {

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