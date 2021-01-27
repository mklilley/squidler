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
