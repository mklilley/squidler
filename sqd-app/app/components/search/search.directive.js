(function () {

    angular
        .module("sqd")
        .directive("search", search);

    search.$inject = ['$timeout'];

               /**
         * @ngdoc directive
         * @name sqd.directive:search
         * @restrict E
         * @scope
         * @param {string} id Unique id for this search element
         * @param {function} select reference to a funcion on the parent scope that handles an image selected from the search list. Takes arguments (id,img), where img is an object of the form { thumb: [thumbnail link],  url: [full image link], from: 'link',type: 'image'}
         * @param {function} hide reference to a function on the parents scope to be called to hide the modal view
         * @description
         * Creates an interfae to searach images from the internet
         */

    function search($timeout) {
        return{
             restrict: "E",
            scope:{},
            bindToController: {
                id:"@",
                select:"&",
                hide:"&",
                active:"="
            },
             templateUrl: 'app/components/search/search.html',
            controller: "SearchController",
            controllerAs: "search",
            link: link

    }


        /////////////////////////////////

                   function link(scope, element, attrs) {

                  scope.$on('modal.shown', function(event, modal) {

            if(modal.id=="search" && scope.search.active){

                 $timeout( function(){

                    angular.element(element).find('input')[0].focus();
                      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.show();
        }

      }, 500);



            }
    });


           }


    }

})();
