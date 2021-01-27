(function () {

    angular
        .module("sqd")
        .directive("fullScreenText", fullScreenText);

    fullScreenText.$inject = ['$timeout'];

                   /**
         * @ngdoc directive
         * @name sqd.directive:fullScreenText
         * @restrict E
         * @scope
         * @param {string} id Unique id for this full screen text element
         * @param {function} hide reference to a function on the parents scope to be called to hide the modal view
        * @param {bool} active A boolean to determine if this full screen text view is currently active
        * @param {object/string} data Will hold all the data associated with the input, i.e. text any media.  Use object if you want to use fullScreenText with check-for-links directive, otherwise you can just use a string
        * @param {string} placeholder Placeholder for the textarea
        * @param {object} form Form element that this fullScreenText belongs to
        * @param {bool} links If true the content of the fullScreenText is checked to see if it contains links, the content of which is then attached to the media key of the data object (obviously data must be an object and not a string in this case)
        * @param {string} sqd-required Specifies if the textarea is a required part of the form (if indeed this fullScreenText is part of a form)
         * @param {bool} valid Is the fullScreenText valid or not
         * @description
         * Creates an interface to edit text in full screen mode
         */

    function fullScreenText($timeout) {

        return{
             restrict: "E",
            scope:{},
            bindToController: {
                id:"@",
                hide:"&",
                active:"=",
                data:"=",
                placeholder:"@",
                form:"=",
                links:"@",
                sqdRequired:"@",
                valid:"="
            },
             templateUrl: 'app/components/fullScreenText/fullScreenText.html',
            controller: "FullScreenTextController",
            controllerAs: "fullScreenText",
            link:link

    }


        ////////////////////////////

           function link(scope, element, attrs) {

                  scope.$on('modal.shown', function(event, modal) {

            if(modal.id=="fullScreenText" && scope.fullScreenText.active){

                 $timeout( function(){

                    angular.element(element).find('textarea')[0].focus();
                      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.show();

        }

        scope.fullScreenText.tapBlock = false;

      }, 500);



            }
    });


           }


    }

})();
