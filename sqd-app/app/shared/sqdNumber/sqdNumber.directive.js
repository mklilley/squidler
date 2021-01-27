(function () {

        angular
            .module('sqd')
            .directive('sqdNumber', sqdNumber)

        sqdNumber.$inject = [];

        /**
         * @ngdoc directive
         * @name sqd.directive:sqdNumber
         * @restrict E
         * @scope 
         * @param {int} min Min value
         * @param {int} max Max value
         * @param {int} step Step size to increment number
         * @param {bool} disabled To tell the input that it cannot be changed
         * @param {int} model value of the model to go into ng-model on the input
         *
         * @description
         * Creates an number input with arrows above and below to increment
         */


        function sqdNumber() {

            var directive = {
                restrict: 'E',
                templateUrl: "app/shared/sqdNumber/sqdNumber.html",
                replace: true,
                scope: {
                    min: "@",
                    max:"@",
                    step:"@",
                    disabled:"@",
                    model:"="
                    
                },
                link: link,
                controller: "SqdNumberController"
            };

            return directive

            ////////////////////////////////////////


            function link(scope, element, attrs) {

  


            }

        }
    }


)();