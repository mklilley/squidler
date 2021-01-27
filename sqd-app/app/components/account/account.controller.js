(function () {
    'use strict';
    angular
        .module('account')
        .controller('AccountController', AccountController)

    AccountController.$inject = ['$ionicLoading', '$ionicModal', '$scope', '$ionicPopup', 'profiles', 'stores', '$q', 'params', '$timeout'];


    function AccountController($ionicLoading, $ionicModal, $scope, $ionicPopup, profiles, stores, $q, params, $timeout) {

        var self = this;

        self.loaded = false;

        self.save = save;
        self.hideCamera = hideCamera;
        self.discard = discard;

        $scope.$on('$ionicView.afterEnter', function(){

          $timeout( function() {
          self.tapBlock = false;
          }, 300);

            self.loaded = true;

            if(!self.camera){

                activateCamera();
            }

        });

        $scope.$on('$ionicView.beforeEnter', function () {
self.tapBlock = true;
});


        activate();



        ////////////////////////////////////////

        function activate() {


            $ionicLoading.show();
            stores.read('users', 'current').then(readProfile).then(activateCamera).catch(popupError);


            //////////////////////

            function readProfile(username) {
                self.username = username;
                return profiles.read(username).then(function (profile) {
                    self.profile = profile;
                    $ionicLoading.hide();
                });
            }

            function popupError() {
                $ionicLoading.hide();
                self.alertPopup = $ionicPopup.alert({
                    title: 'Problem loading your profile :-('
                });

            }


        }

 function activateCamera() {

     if (self.loaded){
                return $ionicModal.fromTemplateUrl('app/components/account/avatarModal.html', {
                    id: "camera",
                    scope: $scope
                }).then(function (modal) {
                    self.camera = modal;
                });}
     else{
     return $q.when();
     }

            }


        function save() {
            $ionicLoading.show();
            var data = {};
            angular.forEach(self.profile, function (value, key) {

                if ((self.profileForm[key] || {}).$dirty) {
                    data[key] = value;
                }

            });

            profiles.update(self.username, data).then(function () {
                $ionicLoading.hide();
                 self.profileForm.$setPristine();

            });

        }


        function hideCamera(cameraId, img) {
            var hasChanged;

            self.camera.hide();
            if (img) {
                hasChanged = img.url == self.profile[cameraId] ? false: true;
                self.profile[cameraId] = img.url;
            } else if (cameraId) {
                hasChanged = true;
             self.profile[cameraId] = "";
            }

            if(hasChanged){
                self.profileForm.avatar.$setDirty();
            }
            else{
             self.profileForm.avatar.$setPristine();
            }

        }


        function discard() {
            self.camera.remove();
            activate();
            self.profileForm.$setPristine();

        }


    }




})();
