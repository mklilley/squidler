(function () {
    'use strict';
    angular
        .module('blank')
        .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {

        $stateProvider
            .state('blank', {
                url: "/blank",
                views: {
                    app: {
                        templateUrl: 'app/components/blank/blank.html'
                    }
                }

            });


    }
    



})();