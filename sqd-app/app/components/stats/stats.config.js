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
