(function () {
    'use strict';
    angular
        .module('info')
        .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {

        $stateProvider
            .state('main.info', {
            url: "/info",
                views: {
                    main: {
                        templateUrl: 'app/components/info/info.html',
                        controller: 'InfoController as info'
      }}

            })



    }


})();
