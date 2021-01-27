(function () {
    'use strict';
    angular
        .module('create')
        .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {

        $stateProvider
              .state('main.create', {
    url: "/create",
            views:  {
                main: {
                 templateUrl: 'app/components/create/create.html',
          controller: 'CreateController as create',
                }
            }
  });




    }
    
    
    





})();


