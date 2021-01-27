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