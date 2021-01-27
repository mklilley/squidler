(function () {
    'use strict';
    angular
        .module('settings')
        .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {

        $stateProvider
            .state('main.settings', {
                url: "/settings",
                views: {
                    main: {
                        templateUrl: 'app/components/settings/settings.html',
                        controller: 'SettingsController as settings'
                    }
                }

            });


    }
    
     angular
        .module('settings')
        .constant('$ionicLoadingConfig',{
  templateUrl: "app/components/loading/loading.html",
          delay:300
});


})();