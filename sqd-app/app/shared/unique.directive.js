(function () {

    angular
        .module('sqd')
        .directive('unique', unique)

    unique.$inject = ['$q', 'users'];
    
       /**
         * @ngdoc directive
         * @name sqd.directive:unique
         * @restrict A
         * @element input
         *
         * @description
         * Username check. This creates an asyncValidator for the input which connects to the backend to check whether the text input matches an existing username.  If the username is already taken the validator will fail, i.e. Angular's formName.inputName.$errors object will be populated with a "unique" entry and formName.inputName.$invalid = true.  Use in conjunction with ngMessages
         */

    function unique($q, users) {

        var directive = {
            restrict: 'A',
            require: 'ngModel',
            link: link
        };

        return directive

        ////////////////////////////////////////

        function link(scope, element, attrs, ngModelCtrl) {

            ngModelCtrl.$asyncValidators.unique = function(modelValue){

                var deferred = $q.defer();

                users.read(modelValue).then(validateFalse,validateTrue);

                return deferred.promise

                ////////////////////////////////////////

                function validateTrue(){

                    deferred.resolve();

                }

                function validateFalse(){

                    deferred.reject();
                }

            }




        }

        }

    }
)();