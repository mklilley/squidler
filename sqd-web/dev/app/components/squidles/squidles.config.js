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
