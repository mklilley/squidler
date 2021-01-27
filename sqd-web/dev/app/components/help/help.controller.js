(function () {
'use strict';
    angular
            .module('help')
            .controller('HelpController',HelpController)

    HelpController.$inject = ['$scope', '$ionicModal', '$ionicLoading', '$ionicPopup', 'emails','faqs', '$stateParams'];


    function HelpController($scope, $ionicModal, $ionicLoading, $ionicPopup, emails, faqs, $stateParams){
        
        var self = this;
        


        self.toggleFAQ = toggleFAQ;
        self.isFAQShown = isFAQShown;
        self.submitQuestion = submitQuestion;
        self.refresh = refresh;
        
        activate();

        $scope.$on('$ionicView.enter', function () {
                if ($stateParams.message) {
                    self.question.message = $stateParams.message;
                    self.askQuestion.show();
                }
            }
        );
        
        
        
        ////////////////////////////////////////
        
        function activate(){

            self.question = {
                name:"",
                email:"",
                message:""
            };

            faqs.read().then(function(data){
                self.FAQs = data;
            });
                          
        $ionicModal.fromTemplateUrl('app/components/help/askQuestionModal.html', {
            scope: $scope
        }).then(function (modal) {
            self.askQuestion = modal;
        });
                            

   
                            
        }


        function refresh() {

            var options = {
                refresh: true
            };

            faqs.read(options).then(function(data) {
                self.FAQs = data;
                $scope.$broadcast('scroll.refreshComplete');
            }).catch(function() {
                $scope.$broadcast('scroll.refreshComplete');

            });

        }


        
        function toggleFAQ(FAQ) {
    if (self.isFAQShown(FAQ)) {
      self.shownFAQ = null;
    } else {
      self.shownFAQ = FAQ;
    }
  }
  function isFAQShown(FAQ) {
    return self.shownFAQ === FAQ;
  }
        
        function submitQuestion(){
            
            if(self.helpForm.$valid){
                
            $ionicLoading.show();

                emails.create(self.question).then(function(){
                    $ionicLoading.hide();
                    self.askQuestion.hide();
                    $ionicPopup.alert({
                        title: "Thanks!",
                        template: "We've received your message",
                        okType: "button-energized"
                    });
                    self.askQuestion.remove().then(function(){
                        activate();
                    });


                });



            }

            else {

                var errorText="";


                angular.forEach(self.helpForm.$error,function(value,key){

                    switch(key) {

                        case "required":
                            errorText = "You need to complete the form";

                            break;
                        case "email":
                            errorText = "Sorry, you've not entered a valid email address";
                            break;

                        case "maxlength":
                            errorText = "Sorry, you've entered more than the 2000 character limit";
                            break;
                        default:
                            break;

                    }


                });


                $ionicPopup.alert({
                    title: "Oops!",
                    template: errorText,
                    okType: "button-assertive"
                });
            }
            

            
        
        }


    }




})();