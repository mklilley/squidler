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
