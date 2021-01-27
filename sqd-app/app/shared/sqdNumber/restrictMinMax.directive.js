(function() {

    angular
      .module('sqd')
      .directive('restrictMinMax', restrictMinMax)

    restrictMinMax.$inject = [];

    /**
     * @ngdoc directive
     * @name sqd.directive:restrictMinMax
     * @restrict A
     * @element input
     *
     * @description
     * Use on number input with min and max attributes set. This directive will prevent users from using keyboard to write numbers outside the range.
     */


    function restrictMinMax() {

      var directive = {
        restrict: 'A',
        link: link,
        require: 'ngModel',
      };

      return directive

      ////////////////////////////////////////


      function link(scope, element, attrs, ngModel) {

        var min = attrs.min,
          max = attrs.max;


        ngModel.$parsers.push(function(value) {

          value = value > max ? max : (value < min ? min : value);
          ngModel.$setViewValue(value);
       ngModel.$render();

          return value

        });




      }

    }
  }


)();
