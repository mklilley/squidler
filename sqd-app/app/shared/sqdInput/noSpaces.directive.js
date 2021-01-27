(function() {

    angular
      .module('sqd')
      .directive('noSpaces', noSpaces)

    noSpaces.$inject = [];

    /**
     * @ngdoc directive
     * @name sqd.directive:noSpaces
     * @restrict A
     * @element input
     *
     * @description
     * Use on an input to stop people from being able to type a space
     */


    function noSpaces() {

      var directive = {
        restrict: 'A',
        link: link,
        require: 'ngModel',
      };

      return directive

      ////////////////////////////////////////


      function link(scope, element, attrs, ngModel) {


        ngModel.$parsers.push(function(value) {

        value =  value.replace(/ /g, '');
          ngModel.$setViewValue(value);
       ngModel.$render();

          return value

        });




      }

    }
  }


)();
