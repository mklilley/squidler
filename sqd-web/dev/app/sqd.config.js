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
