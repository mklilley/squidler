(function () {
    'use strict';
    angular
        .module('sqd')
        .controller('MenuController', MenuController)

    MenuController.$inject = ['$scope', '$rootScope','$state', '$ionicLoading', 'stores', 'profiles', 'params', '$ionicPlatform', '$ionicHistory','$localStorage', '$ionicSideMenuDelegate', '$ionicPopup', '$location'];


    function MenuController($scope, $rootScope,$state, $ionicLoading, stores, profiles, params, $ionicPlatform, $ionicHistory,$localStorage, $ionicSideMenuDelegate, $ionicPopup, $location) {

        var self = this;

        self.items = [];
        self.user = {};


        self.downloadSquidler = downloadSquidler;
        self.path = path;



        $scope.$on('$ionicView.enter', function () {

            var back = ($ionicHistory.viewHistory().backView || {}).stateName;
            if (['welcome','blank'].indexOf(back) > -1) {

                $ionicHistory.clearHistory();

            }
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                expire: 300
            });
        });

        $scope.$on('profileUpdated', updateProfile);

        $scope.$on('$ionicView.enter', function () {
            $ionicSideMenuDelegate.canDragContent(false);
        });



        activate();



        ////////////////////

        function activate() {


            self.items = params.menu().items;


            updateProfile();

        }

        function updateProfile(){

                    stores.read('auth', 'username').then(readProfile);

            //////////////////////

            function readProfile(username) {
                self.username = username;
                 profiles.read(username).then(function (profile) {
                    self.avatar = profile.avatar;
                     self.name = profile.name;
                });
            }



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

        function path(){
            return $location.path();
        }











    }




})();
