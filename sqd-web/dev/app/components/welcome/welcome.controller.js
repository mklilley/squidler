(function () {
    'use strict';
    angular
        .module('welcome')
        .controller('WelcomeController', WelcomeController)

    WelcomeController.$inject = ['$scope', '$rootScope', '$state', '$stateParams','$ionicSlideBoxDelegate', '$ionicModal', '$timeout','$ionicHistory', '$ionicPopup', 'history', '$ionicLoading', 'params','stores','squidles', '$ionicScrollDelegate'];


    function WelcomeController($scope, $rootScope, $state, $stateParams, $ionicSlideBoxDelegate, $ionicModal, $timeout,$ionicHistory, $ionicPopup, history, $ionicLoading, params,stores,squidles, $ionicScrollDelegate) {

        var self = this;


        self.next = next;
        self.previous = previous;
        self.slideChanged = slideChanged;
        self.changeLogo = changeLogo;
        self.downloadSquidler = downloadSquidler;
        self.pageDown = pageDown;


        



        activate();


        ////////////////////

        function activate(){


            
            self.logos = params.welcome().logos;
            
            var numLogos = self.logos.length; 
            
            self.logoIndex = Math.random()/(1.0/parseFloat(numLogos))>>0;
            
            self.logo = self.logos[self.logoIndex];

        }

        function next() {
            $ionicSlideBoxDelegate.next();
        }

        function previous() {
            $ionicSlideBoxDelegate.previous();
        }

        function slideChanged(index) {
            self.activeSlide = index;
        }




        
        function downloadSquidler(){

            // $ionicPopup.alert({
            //     title: "Coming very soon!",
            //     template: "Squidler will be available from Google Play and the App Store in a couple of weeks",
            //     okType: "button-energized"
            // });

            if(ionic.Platform.isIOS()){
                window.open('https://itunes.apple.com/us/app/squidler/id1133896864?ls=1&mt=8', '_system', 'location=yes');
            }
            else if(ionic.Platform.isAndroid()){
                window.open('https://play.google.com/store/apps/details?id=com.squidler', '_system', 'location=yes');
            }
            else{
                $ionicPopup.alert({
                    title: "Sorry",
                    template: "Squidler is only currently available for Android and iOS",
                    okType: "button-assertive"
                })
            }

        }

            function pageDown(pageNumber){
                $ionicScrollDelegate.scrollTo(0, window.innerHeight*pageNumber, true)
        }









        
        
        function changeLogo(){


           
            var numLogos = self.logos.length; 
            
            self.logoIndex  = (self.logoIndex + 1)%numLogos;
            
            self.logo = self.logos[self.logoIndex];
            
            //self.debugMode = true;
            
            
           // subscriptions.create();
        
        }
        

        
        




    }




})();