(function () {

    angular
        .module('sqd')
        .directive('directiveIf', directiveIf)

    directiveIf.$inject = ['$compile'];

    
      /**
         * @ngdoc directive
         * @name sqd.directive:directiveIf
         * @restrict A
         * @param {object} directive-if Any number of directives can be controlled with the object passed in the "directive-if" attribute on this element, e.g. {'myDirective': 'expression'}. If `expression` evaluates to `false` then `attributeName` will be removed from this element, otherwise it will be added
         @description
   * The "directiveIf" directive allows other directives
   * to be dynamically added or removed from this element.
   */
   

    function directiveIf($compile) {
        
        // Error handling.
      var compileGuard = 0;
      // End of error handling.

        var directive = {
             restrict: 'A',
        // Set a high priority so we run before other directives.
        priority: 100,
        // Set terminal to true to stop other directives from running.
        terminal: true,
        compile: compile,
      };
        
         return directive
            
            
            
           //////////////////////////////
        
            function compile() {
                
                var links = {
                    pre: pre,
                    post: post
                };
                
                return links
                
                /////////////////////////////
                
                function pre(scope, element, attr) {


                    // Error handling.
                    // 
                    // Make sure we don't go into an infinite compile loop
                    // if something goes wrong.
                    compileGuard++;
                    if (compileGuard >= 10) {
                        console.log('directiveIf: infinite compile loop!');
                        return;
                    }
                    // End of error handling.


                    // Get the set of directives to apply.
                    var directives = scope.$eval(attr.directiveIf);
                    angular.forEach(directives, function (expr, directive) {
                        // Evaluate each directive expression and remove
                        // the directive attribute if the expression evaluates
                        // to `false`.
                        var result = scope.$eval(expr);
                        if (result === false) {
                            // Set the attribute to `null` to remove the attribute.
                            // 
                            // See: https://docs.angularjs.org/api/ng/type/$compile.directive.Attributes#$set
                            attr.$set(directive, null)
                        }
                        
                        else{
                        attr.$set(directive, true)
                        }
                    });

                    // Remove our own directive before compiling
                    // to avoid infinite compile loops.
                    attr.$set('directiveIf', null);

                    // Recompile the element so the remaining directives
                    // can be invoked.
                    var result = $compile(element)(scope);


                    // Error handling.
                    // 
                    // Reset the compileGuard after compilation
              // (otherwise we can't use this directive multiple times).
              // 
              // It should be safe to reset here because we will
              // only reach this code *after* the `$compile()`
              // call above has returned.
              compileGuard = 0;

                }
                
                function post(scope, element, attr){
                
                }

          
  
        }
            
            
            
            
                   

        
        


        }

        }

    
)();
