(function () {

    angular
        .module('sqd')
        .directive('checkForLinks', checkForLinks)

    checkForLinks.$inject = ['$q', 'links', 'stores', 'exceptions'];

    /**
     * @ngdoc directive
     * @name sqd.directive:checkForLinks
     * @restrict A
     * @element sqd-input
     *
     * @description
     * Applied to a sqd-input element with "model" attribute set to be an object. It scans the text input to check for links inside.  If it finds a link it will remove it from the text and the attachable content from the link will be added to the "media" key of the "model" object on the scope of the sqd-input. If there is no image or video data it will replace the link with a google shortlink.  Uses link.service
     */

    function checkForLinks($q, links, stores, exceptions) {

        var directive = {
            restrict: 'A',
            require: 'ngModel',
            link: link
        };

        return directive

        ////////////////////////////////////////

        function link(scope, element, attrs, ngModelCrtl) {


            ngModelCrtl.$parsers.push(function (modelValue) {

                if (!scope.model.media) {


                    var deferred = $q.defer();

                    links.read(modelValue).then(updateModel).catch(doNothing);

                    return deferred.promise

                

                } else {

                    return modelValue
                }
                
                 ////////////////////////////////////////
                
                 function updateModel(data) {
                        if (data.data) {
                            data.data.from = "link";
                            var temp = {
                                text: data.text,
                                media: data.data
                            };
                            scope.model = temp;
                            scope.text = data.text;


                        } else {
                            scope.model = data;
                            scope.text = data.text;
                        }




                        deferred.resolve();

                    }
                
                function doNothing(data){
                            scope.model = data;
                            scope.text = data.text;
                }



            });




        }

    }

})();