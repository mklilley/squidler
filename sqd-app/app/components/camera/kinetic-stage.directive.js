(function () {

    angular
        .module('camera')
        .directive('kineticStage', kineticStage)

    kineticStage.$inject = ['Kinetic'];
    
           /**
         * @ngdoc directive
         * @name camera.directive:kineticStage
         * @restrict A
         * @element div
         * @description
         * Creates a kinetic stage within this div, which is registered on the camera controller under the "stage" variable
         */

    function kineticStage(Kinetic) {

        var directive = {
            restrict: 'A',
            require: '^camera',
            link: link
        };

        return directive

        ////////////////////////////////////////
        
        function link(scope, element, attrs, cameraController){
            
             cameraController.stage = new Kinetic.Stage({
                container: element[0],
                width: window.innerWidth,
                height: window.innerHeight-120

            });
            
            cameraController.activate();

        
        }


        }

    }
)();


