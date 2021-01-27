(function () {
    'use strict';
    angular
        .module('camera')
        .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {

        $stateProvider
              .state('camera', {
    url: "/camera",
            views:  {
                app: {
                 templateUrl: 'app/components/camera/cameraModal.html'
                }
            }
  });




    }
    
    




})();


