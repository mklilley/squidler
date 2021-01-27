(function () {
    'use strict';
    angular
        .module('create')
        .controller('CreateController', CreateController)

    CreateController.$inject = ['$rootScope', '$scope', '$ionicModal', '$stateParams', '$ionicLoading', '$state', '$ionicPopup', 'squidles', '$ionicHistory', 'stores', 'links', 'users', 'files', 'params', '$timeout'];


    function CreateController($rootScope, $scope, $ionicModal, $stateParams, $ionicLoading, $state, $ionicPopup, squidles, $ionicHistory, stores, links, users, files, params, $timeout) {

        var self = this;

        self.prizeImg = "";
        self.prize = {};
        self.showImageControls = false;
        self.panelText;
        self.contentHeight = window.innerHeight - 44;
        self.maxPanelHeight = self.contentHeight*0.8;
        self.minPanelHeight = self.contentHeight*0.1;
        self.normalPanelHeight = self.contentHeight*0.33;
        


        self.showCamera = showCamera;
        self.hideCamera = hideCamera;
        self.showSearch = showSearch;
        self.hideSearch = hideSearch;
        self.showFullScreenText = showFullScreenText;
        self.hideFullScreenText = hideFullScreenText;
        self.panelSize = panelSize;
        self.toggleImageControls = toggleImageControls;
        self.next = next;
        self.deleteImage = deleteImage;
        self.canEdit = canEdit;
        self.togglePanel = togglePanel;
        self.previewSquidle = previewSquidle;
        self.calcStyle = calcStyle;


        $scope.$on("processSquide", function () {
            processSquidle();
        });

        $scope.$on('$ionicView.afterEnter', function () {

            if (!self.fullScreenText) {

                activateModals();
            }

        });


        activate();





        ////////////////////////////////////////

        function activate() {
             self.activePanel = "";
            self.squidle = {
                prize: {text:""},
                challenge: {text:""},
                answer: {text:""}
            };

            self.nextText = params.create().nextText;
            self.panelText = params.create().panelText;
            self.placeholderText = params.create().placeholderText;
            




        }

        function activateModals() {

            



            stores.read('tempSquidle').then(function (data) {

                self.squidle = data;

                

                $ionicModal.fromTemplateUrl('app/components/fullScreenText/fullScreenTextModal.html', {
                    id: "fullScreenText",
                    scope: $scope
                }).then(function (modal) {
                    self.fullScreenText = modal;
                });


            });


        }





        function showCamera() {
            
            if (!self.camera) {

                $ionicModal.fromTemplateUrl('app/components/camera/cameraModal.html', {
                    id: "camera",
                    scope: $scope
                }).then(function (modal) {
                    self.camera = modal;
                    self.camera.show();
                });
            }
            
            else{
                
                self.camera.show();
            }
            
            
            
            
        }
        
                      
        function hideCamera(cameraId, img) {

            self.camera.hide();
            if (img) {
                stores.update('tempSquidle', cameraId, {
                    media: img
                });
                self.squidle[cameraId].media = img;
            } 
            
            else if (cameraId) {

                stores.remove('tempSquidle', cameraId, ['media']);
                delete self.squidle[cameraId].media;

            }
        }

        function showSearch() {
            
            if (!self.search) {
            $ionicModal.fromTemplateUrl('app/components/search/searchModal.html', {
                id: "search",
                scope: $scope
            }).then(function (modal) {
                self.search = modal;
                self.search.show();
            });
            }
            else{
                self.search.show();
            }
            
            
        }

        function hideSearch(searchId, img) {
            
            self.search.hide();
            
            if (img) {
                self.squidle[searchId].media = img;
                stores.update('tempSquidle', searchId, {
                  media: img
              });
            }
        }

        function showFullScreenText() {
            self.fullScreenText.show();
        }

        function hideFullScreenText(textId) {
 
            self.fullScreenText.hide();
             stores.update('tempSquidle', textId, {
                  text: self.squidle[textId].text,
                 media:  self.squidle[textId].media
              });
        }




        function panelSize(panelLabel) {

            return self.activePanel != "" ? (self.activePanel == panelLabel ? "80%" : "10%") : "33.33%"

        }

        function toggleImageControls() {

            self.showImageControls = !self.showImageControls
            return

        }

        function togglePanel(panelLabel) {

            self.activePanel = self.activePanel == panelLabel ? "" : panelLabel;
                                
          $timeout(function () {
              $rootScope.$broadcast('showWalkthrough',self.activePanel)
              
                    },300);
                
                  
                           
                

         
        }



        function next(key) {

            switch (key) {
                case "answer":

                    processSquidle();
                    break;

                case "challenge":
                    self.activePanel = "answer";
                    break;
                case "prize":

                    self.activePanel = "challenge";

                    break;
                default:
                    break;

            }




        }

        function processSquidle() {
            
            
            var validPrize = ((self.squidle.prize.text!="") || self.squidle.prize.media) ? true: false;
            
            self.squidleForm.prize.$setValidity("required",validPrize);
            
            
            if (self.squidleForm.$valid) {

                $ionicLoading.show();
                squidles.create(preProcess(self.squidle)).then(function (response) {

                    $ionicLoading.hide();
                    activate();
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $state.go('main.share', {
                        squidleId: response.short
                    });
                });
            } 
            
            else {
                
            var errorText="";
            
            
            angular.forEach(self.squidleForm.$error,function(value,key){
                
                switch(key) {
                        
                    case "required":
                        errorText += "Squidle incomplete - see";
                        angular.forEach(value,function(value,key){
                            errorText += " ";
                            errorText += value.$name;
                            
                            
                        });
                        errorText += ". ";
                        break;
                    case "maxlength":
                          errorText += "Squidle text too long - see";
                        angular.forEach(value,function(value,key){
                                                        errorText += " ";
                            errorText += value.$name;

                            
                        });
                        errorText += ". ";
                        break;
                         default:
                        break; 
                         
                }
                             
                
            });
            
                
                $ionicPopup.alert({
                    title: "Can't lock your Squidle",
                    template: errorText,
                    okType: "button-assertive"
                });
            }


        }

        function preProcess(squidle) {
            var data = {
                prize: {},
                challenge: {},
                answer: {}
            };


            data.answer.text = {
                value: squidle.answer.text
            };

            data.challenge.text = {
                value: squidle.challenge.text
            };

            data.prize.text = {
                value: squidle.prize.text
            };

            if (squidle.challenge.media) {

                if (squidle.challenge.media.type == "image") {
                    data.challenge.photo = {
                        value: squidle.challenge.media.url
                    };
                    data.challenge.photo.uploaded = squidle.challenge.media.from == "device" ? true : false;

                } else if (squidle.challenge.media.type == "video") {
                    data.challenge.video = {
                        value: squidle.challenge.media.url
                    }
                }

            }


            if (squidle.prize.media) {

                if (squidle.prize.media.type == "image") {
                    data.prize.photo = {
                        value: squidle.prize.media.url
                    };
                    data.prize.photo.uploaded = squidle.prize.media.from == "device" ? true : false;

                } else if (squidle.prize.media.type == "video") {
                    data.prize.video = {
                        value: squidle.prize.media.url
                    }
                }

            }




            return data
        }

        function deleteImage(label) {

            delete self.squidle[label].media;
            stores.remove('tempSquidle', label, ['media']);



        }

        function canEdit(label) {

            return self.squidle[label].media.from == 'device' ? true : false


        }


        function previewSquidle() {

            stores.update('preview', 'squidle', preProcess(self.squidle)).then(function (response) {

                $state.go('main.squidle', {
                    squidleId: "preview"
                });

            });
            



        }
        
        
                    function calcStyle(panelLabel){
                        
                var margin;
                
                if(self.activePanel==''){
                    
                margin = (self.normalPanelHeight-75)/2 -20;
                    
                return {'margin-top':margin+'px'}
                    
                    
                }
                else if(self.activePanel!= panelLabel){
                    
                    margin = (self.minPanelHeight-25)/2 -20;
                    
                    return {'margin-top':margin+'px'
                           }
                }
                
            }
        



    }







})();