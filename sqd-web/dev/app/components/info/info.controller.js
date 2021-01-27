(function () {
'use strict';
    angular
            .module('info')
            .controller('InfoController',InfoController)

    InfoController.$inject = ['params', '$ionicScrollDelegate', 'stores'];


    function InfoController(params, $ionicScrollDelegate, stores){

        var self = this;

        self.changeLogo = changeLogo;
        self.pageDown = pageDown;


        activate();


        ///////////////////////////


        function activate(){

            stores.read('version','current').then(function(version){
               self.version = version;
            });

            self.logos = params.welcome().logos;

            var numLogos = self.logos.length;

            self.logoIndex = Math.random()/(1.0/parseFloat(numLogos))>>0;

            self.logo = self.logos[self.logoIndex];
        }



        function changeLogo(){

            var numLogos = self.logos.length;

            self.logoIndex  = (self.logoIndex + 1)%numLogos;

            self.logo = self.logos[self.logoIndex];


        }


        function pageDown(pageNumber){
            $ionicScrollDelegate.scrollTo(0, (window.innerHeight-44)*pageNumber, true)
        }


    }




})();