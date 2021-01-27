(function () {

    angular
        .module('squidles')
        .directive('sqdPause', sqdPause)

    sqdPause.$inject = [];
    
       /**
         * @ngdoc directive
         * @name squidles.directive:sqdPause
         * @restrict A
         * @element iframe
         *
         * @description
         * Allows an iframe to be programatically paused by broadcasting the event 'pause' to the scope using  $scope.$broadcast('pause')
         */

    function sqdPause() {

        var directive = {
            restrict: 'A',
            link: link
        };

        return directive

        ////////////////////////////////////////

        function link(scope, element, attrs) {


            
            scope.$on('pause', pause);
    
                ////////////////////////////////////////
            
            function pause(){
                
                var iframe = element[0].contentWindow;
                    
 iframe.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
    
     

            
            }




            }


        }

        }

    
)();