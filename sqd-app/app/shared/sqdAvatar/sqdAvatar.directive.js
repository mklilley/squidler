(function () {

    angular
        .module('sqd')
        .directive('sqdAvatar', sqdAvatar)

    sqdAvatar.$inject = ['$q', 'links', 'stores', 'exceptions'];

    /**
     * @ngdoc directive
     * @name sqd.directive:sqdAvatar
     * @restrict E
    * @param {string} src A variable that should contain, or evaluate to a url of a profile image
    * @param {string} letterFrom A variable that hold text from which to create two letters to create a letter avatar
     *
     * @description
     * 
     */

    function sqdAvatar($q, links, stores, exceptions) {

            var directive = {
                restrict: 'E',
                templateUrl: "app/shared/sqdAvatar/sqdAvatar.html",
                replace: true,
                scope: {
                    src: "@",
                    letterFrom: "@",
                },
                link: link,
                controller: "SqdAvatarController"
            };

            return directive

        ////////////////////////////////////////

        function link(scope, element, attrs) {
            
           attrs.$observe('letterFrom', function(val){
                   
                scope.letter = attrs.letterFrom.charAt(0).toUpperCase();
               
               var letterCode = scope.letter.charCodeAt() - 64;

               
              var colourCode = letterCode <=7 ? '#FBAB00' : (letterCode <=14 ? '#FF6B01' : '#FF2A01');
               
               scope.colour = {'background-color':colourCode};
                          
                          });

            
            

                
                 ////////////////////////////////////////
                





        }

    }

})();