(function () {
    'use strict';
    angular
        .module('welcome')
        .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {

        $stateProvider
            .state('welcome', {
                url: "/welcome",
                views: {
                    app: {
                        templateUrl: 'app/components/welcome/welcome.html',
                        controller: 'WelcomeController as welcome'
                    }
                }

            });


    }
    



})();