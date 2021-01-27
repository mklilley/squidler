(function () {
'use strict';
    angular
            .module('squidles')

.directive('holdForOptionsWrapper', [function() {
	return {
		restrict: 'A',
		controller: ['$scope',function($scope) {
			this.closeOptions = function() {
				$scope.$broadcast('closeOptions');
			}
		}]
	};
}]);



})();