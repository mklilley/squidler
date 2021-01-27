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
