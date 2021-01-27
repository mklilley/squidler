(function () {
    'use strict';
    angular
        .module('help')
        .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {

        $stateProvider
            .state('main.help', {
                url: "/help?message&email&name",
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
