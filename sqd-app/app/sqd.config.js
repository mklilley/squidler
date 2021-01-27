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