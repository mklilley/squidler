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