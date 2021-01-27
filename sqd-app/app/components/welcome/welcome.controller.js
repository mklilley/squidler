(function () {
    'use strict';
    angular
        .module('welcome')
        .controller('WelcomeController', WelcomeController)

    WelcomeController.$inject = ['$scope', '$rootScope', '$state', '$ionicSlideBoxDelegate', '$ionicModal', '$timeout','$ionicHistory', '$ionicPopup', 'login', 'history', '$ionicLoading', 'params','stores','subscriptions','squidles'];


    function WelcomeController($scope, $rootScope, $state, $ionicSlideBoxDelegate, $ionicModal, $timeout,$ionicHistory, $ionicPopup,login, history, $ionicLoading, params,stores,subscriptions,squidles) {

        var self = this;

        self.slideIndex = 0;
        self.debugMode = false;
        self.debugMessages = [];
        self.api = "https://dev.squidler.com/api/v1/subscriptions";
        self.productId = "create_squidle_01";

        self.next = next;
        self.previous = previous;
        self.slideChanged = slideChanged;
        self.letsGo = letsGo;
        self.closeSignup = closeSignup;
        self.doSignup = doSignup;
        self.changeLogo = changeLogo;
        self.finishLogin = finishLogin;
        self.testBuy = testBuy;
        self.testRestore = testRestore;
        self.testVerify = testVerify;

        
        $scope.$on('iap',function(event,data){
            
            
            self.debugMessages.push(data);
            
        });
        
        


        activate();


        ////////////////////

        function activate(){
            
            self.logos = params.welcome().logos;
            
            var numLogos = self.logos.length; 
            
            self.logoIndex = Math.random()/(1.0/parseFloat(numLogos))>>0;
            
            self.logo = self.logos[self.logoIndex];
                // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('app/components/welcome/signupModal.html', {
            id: "signup",
            scope: $scope
        }).then(function (modal) {
            self.modal = modal;
        });
        }

        function next() {
            $ionicSlideBoxDelegate.next();
        };

        function previous() {
            $ionicSlideBoxDelegate.previous();
        };

        function slideChanged(index) {
            self.slideIndex = index;
        };

        // Open the login modal
        function letsGo() {
            self.modal.show();
        };

        // Triggered in the login modal to close it
        function closeSignup() {
            self.modal.hide();
        };
        
        
        
                function doSignup(){
                    
                    
                 
            
             if(self.signupForm.$valid){
                
                 $ionicLoading.show();
                 subscriptions.create({loginDetails:{username:self.username, password:self.password}}).then(function(){
                     
                     
                    return squidles.read({short:'welcome'});
                     
                   
                     
                 }).then(function(){
                     stores.update('usageData','opens',{number:1});
                     
                     $rootScope.alreadyOpen = true;
                        $ionicLoading.hide();
                     self.finishLogin();
                     
                 });
                 
                 
             }
            
            else{
                         $ionicPopup.alert({
     title: "Signup form incomplete",
                             okType: "button-assertive"
   });
            }
        
        }



        function finishLogin(){
            self.closeSignup();
            $state.go('main.squidles');
            
        }
        
        
        function changeLogo(){
           
            var numLogos = self.logos.length; 
            
            self.logoIndex  = (self.logoIndex + 1)%numLogos;
            
            self.logo = self.logos[self.logoIndex];
            
            //self.debugMode = true;
            
            
           // subscriptions.create();
        
        }
        
        function testBuy(){
            
            subscriptions.create({productId:self.productId});
            
        }
        
        
        function testRestore(){
            
            subscriptions.read({subscriptions:true,productId:self.productId});
            
        }
        
        function testVerify(){
            
             subscriptions.verify({api:self.api});
            
        }
        
        
        




    }




})();