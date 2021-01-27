(function () {

        angular
            .module('sqd')
            .directive('sqdInput', sqdInput)

        sqdInput.$inject = ['$rootScope'];

        /**
         * @ngdoc directive
         * @name sqd.directive:sqdInput
         * @restrict E
         * @scope
         * @param {string} type Same a for html input element
         * @param {string} placeholder Same a for html input element
         * @param {string} name Same a for html input element
         * @param {string} sqdRequired Is the input required
         * @param {int} maxlength Make the input/textarea invalid if its length is greater than this
         * @param {string or object} model Holds the data associated with the input, note this can be just text (use string) and/or media (use object) depending on whether checkForLinks has been selected as an attribute. If set as an object it will have the form {text:[],media:[]}
         * @param {string} ng-readonly Same a for html input element with angularJS
         * @param {bool} valid Is the input valid or not
         * @param {bool} textarea Is the input a textarea
         * @param {object} form Form element that this input belongs to
         * @param {string} colour Class name for the colour of the input
         * @param {string} background Class name for the background colour of the view that the input is inside of
         * @param {bool} links If true the content of the input is checked to see if it contains links, the content of which is then attached to the media key of the model object. Note "model" must be an object not a string for this
         * @param {bool} nospaces If true then the user will be forbidden from typing a space into the input
         * ' @params {bool} checkUsername If true the input will by checked on the  backend to see if it corresponds to an existing username or not
         * * @params {string} enter-submit Prevents "enter" from its doing its default action and instead broadcasts a submit message of the form "submit-{string}"
         *
         * @description
         * Creates an input/textarea with some UI elements to allow the user to e.g. delete all text and also see if input is valid. Also allows the input to be scanned for attachable content from the web. Enter key will prevent default action (shift enter still works for textareas) and broadcasts submit-{name of form}
         */


        function sqdInput($rootScope) {

            var directive = {
                restrict: 'E',
                templateUrl: templateUrl,
                replace: true,
                scope: {
                    type: "@",
                    placeholder: "@",
                    model: "=",
                    ngReadonly: "@",
                    valid: "=",
                    name: "@",
                    form: "=",
                    textarea: "@",
                    colour: "@",
                    background: "@",
                    links: "@",
                    sqdRequired:"@",
                    maxlength:"@",
                    nospaces:"@",
                    checkUsername:"@",
                    enterSubmit:"@"
                },
                link: link,
                controller: "SqdInputController"
            };

            return directive

            ////////////////////////////////////////

            function templateUrl(element, attrs) {

                var url = attrs.textarea ? "app/shared/sqdInput/sqdTextArea.html" : "app/shared/sqdInput/sqdInput.html";

                return url

            }

            function link(scope, element, attrs, ngModelCrtl) {

                //Sync the model with the text, this is needed because we allow the option to have an object or string for the model

                scope.$watch('text', function (val) {
                    if(val!=undefined){
                    if (typeof scope.model === 'object') {
                        scope.model.text = val;
                    } else {
                        scope.model = val;
                    }
                }
                });

                 scope.$watch('model', function (val) {
                      if(val!=undefined){
                    if (typeof scope.model === 'object') {
                        scope.text = val.text;
                    } else {
                        scope.text = val;
                    }
                      }
                }, true);

                if(scope.enterSubmit){
                    element.bind('keydown', function(event) {
                        var code = event.keyCode || event.which;
                        if (code === 13) {
                            if (!event.shiftKey) {
                                event.preventDefault();
                                element.find(scope.textarea ? "textarea" : "input")[0].blur();
                                scope.focus=false;
                                $rootScope.$broadcast('submit-'+scope.enterSubmit);
                            }
                        }
                    });
                }









            }

        }
    }


)();
