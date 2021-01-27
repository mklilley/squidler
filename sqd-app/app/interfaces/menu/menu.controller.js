(function () {
    'use strict';
    angular
        .module('sqd')
        .controller('MenuController', MenuController)

    MenuController.$inject = ['$scope', '$rootScope','$state', '$ionicLoading', 'stores', 'profiles', 'params', '$ionicPlatform', '$ionicHistory','$localStorage'];


    function MenuController($scope, $rootScope,$state, $ionicLoading, stores, profiles, params, $ionicPlatform, $ionicHistory,$localStorage) {

        var self = this;

        self.items = [];
        self.user = {};

        activate();

        $scope.$on('$ionicView.enter', function () {
            var back = ($ionicHistory.viewHistory().backView || {}).stateName;
            if (['welcome','blank'].indexOf(back) > -1) {

                $ionicHistory.clearHistory();

            }
        });
        
        $scope.$on('profileUpdated', updateProfile);


        ////////////////////

        function activate() {
            
            self.items = params.menu().items;
           
            
            updateProfile();
            
        }
        
        function updateProfile(){
        
                    stores.read('users', 'current').then(readProfile);

            //////////////////////

            function readProfile(username) {
                self.username = username;
                 profiles.read(username).then(function (profile) {
                    self.avatar = profile.avatar;
                     self.first_name = profile.first_name;
                });
            }

        
        
        }
        






        



    }




})();