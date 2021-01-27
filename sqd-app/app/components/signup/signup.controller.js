(function () {
'use strict';
    angular
            .module('signup')
            .controller('SignupController',SignupController)

    SignupController.$inject = ['$scope', '$ionicPopup', 'login'];


    function SignupController($scope, $ionicPopup, login){
        
        var self = this;
        
        
        self.doSignup = doSignup;
        
        
        /////////////////////////
        
        function doSignup(){
            
             if(self.signupForm.$valid){

             login({username:self.username, password:self.password}).then(
            function(){ 
            history.read().then(function(){
            $scope.finishLogin();
            
            });
            }
            );
                 
             }
            
            else{
                         $ionicPopup.alert({
     title: "Signup form incomplete"
   });
            }
        
        }


    }




})();