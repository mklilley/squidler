(function () {

    angular
        .module('camera')
        .directive('camera', camera)

    camera.$inject = [];
    
           /**
         * @ngdoc directive
         * @name camera.directive:camera
         * @restrict E
         * @scope 
         * @param {string} id Unique id for this camera element
         * @param {string} image datURI representing a saved image
         * @param {function} close a function to be called from the parent scope that allows the camera modal to be closed.
         * @param {bool} active A boolean to determine if this camera is currently active
         * @description
         * Creates an interfae to take photos and edit them
         */

    function camera() {

        var directive = {
            restrict: 'E',
            scope: {
                id:"@",
                image:"=",
                close:"&",
                active:"="
            },
            templateUrl: 'app/components/camera/camera.html',
            controller: 'CameraController',
            controllerAs: 'camera'
        };

        return directive

        ////////////////////////////////////////


        }

    }
)();


