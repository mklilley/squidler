(function () {
    'use strict';
    angular
        .module('camera')
        .controller('CameraController', CameraController)

    CameraController.$inject = ['$scope', '$ionicPopup', 'image', 'crop', 'draw', '$ionicActionSheet', '$ionicPlatform', '$cordovaImagePicker', '$cordovaCamera','$ionicLoading'];


    function CameraController($scope, $ionicPopup, image, crop, draw, $ionicActionSheet, $ionicPlatform, $cordovaImagePicker, $cordovaCamera,$ionicLoading) {
        

        

        var self = this;

        self.backupImage = {};
        self.colour = {};
        self.layers = {};
        self.objects = {};
        self.colour.value = "#0AAECA";
        self.panel="start";
        self.changes = false;
        
        self.activate = activate;
        self.loadImage = loadImage;
        self.reset = reset;
        self.initRevert = initRevert;
        self.save = save;
        self.initCrop = initCrop;
        self.finishCrop = finishCrop
        self.startDrawing = startDrawing;
        self.stopDrawing = stopDrawing;
        self.undo = undo;
        self.discardChanges = discardChanges;
        self.initDelete = initDelete;
        self.deleteImage = deleteImage;
        self.cancel = cancel;
        self.CTA = CTA;
        self.isActive = isActive;
        self.textCTA = textCTA;
        self.retake = retake;
        self.changeColour = changeColour;
        self.loadActionSheet = loadActionSheet;
        self.fromGallery = fromGallery;
        self.fromCamera = fromCamera;
        
        $scope.$on('modal.shown', function(event, modal) {
            if(modal.id=="camera" && !($scope.image) && $scope.active){
                reset();
                self.backupImage = {};
                delete self.saved;
      retake();}
    });




        ////////////////////

        //NOTE, this function is used by the kinetic-stage directive link function
        function activate() {
           
            
            if($scope.image){
            loadImage($scope.image).then(function(){
                self.changes = false;
    
                
            });
            
            }
            


        }
        
        function switchTo(panelLabel){
            self.panel = panelLabel;
        }
        
        function isActive(panelLabel){
             return self.panel == panelLabel;
        }
        
        function retake(){
            
            
            if(ionic.Platform.isWebView()){
                
               loadActionSheet();
                
            }
            else{
            document.getElementById("attach-input-"+$scope.id).click();
            }
          
        }
        
        function loadActionSheet(){
            
         $ionicActionSheet.show({
     buttons: [
       { text: '<i class="icon sqd-icon-camera positive"></i> Camera' },
       { text: '<i class="icon ion-images assertive"></i> Gallery' }
     ],
     titleText: 'Get image from:',
     cancelText: 'Cancel',
     cancel: function() {
          if(Object.keys(self.backupImage).length === 0){
          $scope.close();
          }
        },
     buttonClicked: function(index) {
         $ionicLoading.show();
         if(index==0){
         fromCamera();
         }
         else{
         fromGallery()
         }
       return true;
     }
   });
        
        }
        
        function fromGallery() {

            try {
                $ionicPlatform.ready(function () {

                    var options = {
                        maximumImagesCount: 1,
                        width: 0,
                        height: 0,
                        quality: 100
                    };

                    $cordovaImagePicker.getPictures(options).then(processImage, handleLoadError);

                });
            } 
            catch (error) {
               $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Failed to load gallery :-(',
                    okType: "button-assertive"
                }).then(function () {
                    if (Object.keys(self.backupImage).length === 0) {
                        $scope.close()
                    }
                });
            }


            //////////////////////////////


            function processImage(results) {
                for (var i = 0; i < results.length; i++) {
                    loadImage(results[i]);
                }
                if(results.length==0){
                    $ionicLoading.hide();
                if (Object.keys(self.backupImage).length === 0) {
                     
                        $scope.close();
                    }
                }
            }

            function handleLoadError(error) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Failed to load image from gallery :-(',
                    okType: "button-assertive"
                }).then(function () {
                    if (Object.keys(self.backupImage).length === 0) {
                        $scope.close()
                    }
                });
            }



        }
        
        
        function fromCamera() {

            try {
                $ionicPlatform.ready(function () {

                    var options = {
                        destinationType: Camera.DestinationType.FILE_URI,
                        sourceType: Camera.PictureSourceType.CAMERA,
                    };



                    $cordovaCamera.getPicture(options).then(processImage, handleLoadError);

                });
            } catch (error) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Failed to load camera :-(',
                    okType: "button-assertive"
                }).then(function () {
                    if (Object.keys(self.backupImage).length === 0) {
                        $scope.close()
                    }
                });
            }


            //////////////////////////////

            function processImage(imageURI) {

                if (imageURI) {

                    loadImage(imageURI);
                } else {
                    $ionicLoading.hide();
                    if (Object.keys(self.backupImage).length === 0) {
                        $scope.close();
                    }
                }

            }

            function handleLoadError(error) {
                 $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Failed to load image from camera :-(',
                    okType: "button-assertive"
                }).then(function () {
                    if (Object.keys(self.backupImage).length === 0) {
                        $scope.close()
                    }
                });

            }



        }


        function changeColour(colour){
            
            switch (colour) {
                case 'red':
                    self.colour.value = "#FF2A01"
                    break;
                case 'blue':
                    self.colour.value = "#0AAECA"
                    break;
                case 'green':
                    self.colour.value = "#0BCA6A"
                    break;
                 case 'yellow':
                    self.colour.value = "#F4E101"
                    break;
                default:
                     self.colour.value = "#0AAECA"
                    break;
            }
                    
        }
    
        
        

        function loadImage(input) {
            
            var dataURI;
            
            if(typeof input === 'string'){
                
                dataURI = input;
                
            }
            
            else{
                $ionicLoading.show();
                dataURI = URL.createObjectURL(input.files[0]);
                input.value='';
            }



           return image.load(dataURI).then(function (data) {
                reset();

                
                self.backupImage = data;
                image.render(self.stage, self.layers, self.objects, data);
                    self.changes = true;
               self.overwritingOldImage = $scope.image ? true : false;
                delete self.saved;
               $ionicLoading.hide();
             
            }).catch(function(){
               
               $ionicLoading.hide();
           });


        }




        function reset() {


            self.stage.clear();

            angular.forEach(self.stage.children, function (layer, key) {

                layer.destroy();

            });



            self.layers = {};
            self.objects = {};
            switchTo("start");
             self.changes = false;




        }





        function initCrop() {
            if(!isActive("crop")){

            switchTo("crop");
            self.layerCrop = crop.start(self.stage, self.layers, self.objects);
            }


        }

        function finishCrop() {


            crop.finish(self.stage, self.layers, self.objects, self.backupImage);
            self.changes = true;
            switchTo("start");

        }
        
        function cancelCrop(){
        crop.cancel(self.layers);
             switchTo("start");
        }
        
        function initRevert(){
                      if(!isActive("reset")){
            switchTo("reset");
               var confirmPopup = $ionicPopup.confirm({
     title: 'Reset Image',
     template: 'Are you sure you want to discard <strong>ALL</strong> your changes?',
                       okType: "button-energized"
                   
   });
   confirmPopup.then(function(res) {
     if(res) {
       revert();
     } else {
          switchTo("start");
     }
   });
                      }
        
        }

        function revert() {
            reset();
            image.render(self.stage, self.layers, self.objects, self.backupImage);
            self.changes = true;
             switchTo("start");


        }

        function save() {


            image.save(self.stage, self.layers, self.objects).then(function (data) {

                $scope.image = data.image;
                
               var img = {
                  thumb: data.image,
                  url: data.image,
                  from: 'device',
                  type: 'image'
              };
                
                $scope.close({
                    img: img,
                    id: $scope.id
                });
                self.saved = data.saved;
                
              self.changes = false;

            })
            
            

        }

        function startDrawing() {
            if(!isActive("draw")){

            switchTo("draw");
            draw.start(self.stage, self.layers, self.objects, self.colour);
            }

        }

        function stopDrawing() {

            draw.stop(self.objects);
            self.changes = true;
            switchTo("start");

        }

        function undo(all) {
            all = all ? all : false
            
            if (self.objects.lines) {
                draw.undo(self.stage, self.layers, self.objects, all);
            }

        }

        function discardChanges() {
if(self.saved){
            image.discardChanges(self.stage, self.layers, self.objects, self.saved);
    
                   var img = {
                  thumb: $scope.image,
                  url: $scope.image,
                  from: 'device',
                  type: 'image'
              };

            $scope.close({
                img: img,
                id: $scope.id
            });}
            else if(self.overwritingOldImage){
                
                var img = {
                  thumb: $scope.image,
                  url: $scope.image,
                  from: 'device',
                  type: 'image'
              };
                
                 reset();
                self.backupImage = {};
                activate();
                
                $scope.close({
                img: img,
                id: $scope.id
            });
                
            }
            else{
            deleteImage();
            }
            
            self.changes = false;


        }
        
        function initDelete(){
                      if(!isActive("delete")){
                    switchTo("delete");
               var confirmPopup = $ionicPopup.confirm({
     title: 'Delete Image',
     template: 'Are you sure you want to delete your image?',
    okType: "button-energized"
   });
   confirmPopup.then(function(res) {
     if(res) {
       deleteImage();
     } else {
          switchTo("start");
     }
   });
        }
        }

        function deleteImage() {

            reset();
            
            self.backupImage = {};
            delete self.saved;
           
            $scope.close({
                 id: $scope.id
            });




        }
        
        function cancel(){
            
            switch (self.panel) {
                case 'start':
            if (self.changes){
                
                
   var confirmPopup = $ionicPopup.confirm({
     title: 'Discard Changes',
     template: 'Are you sure you want to discard your most recent changes?',
           okType: "button-energized"
   });
   confirmPopup.then(function(res) {
     if(res) {
       discardChanges();
     } else {
     }
   });
             
            }
            else{
                 $scope.close();
            }
                    break;
                case 'crop':
                cancelCrop();
                switchTo("start");
                    break;
                case 'draw':
                    var all = true;
                    undo(all);
                switchTo("start");

                    break;
                case 'reset':
            switchTo("start");

                    break;
                case 'delete':
            switchTo("start");
                       break;
                default:
                    break;
                }
            
              
        
        
        }
        
        
        
        
        
        
        
        
        
        function textCTA(){
    var text

            switch (this.panel) {
                case 'start':
    text = "Attach"
                    break;
                case 'crop':
     text = "Crop";
                    break;
                case 'draw':
    text = "OK";

                    break;
                case 'reset':
    text = "Reset";

                    break;
                case 'delete':
    text = "Delete";
                       break;
                default:
                    break;
                }

    return text
}



        function CTA(){

        switch (this.panel) {
                case 'start':
                    save();
                    break;
                case 'crop':
                    finishCrop();
                switchTo('start');
                    break;
                case 'draw':
                stopDrawing();
                switchTo('start');
                    break;
                case 'reset':
                    revert();
                switchTo('start');
                    break;
                case 'delete':
                    deleteImage();
                switchTo('start');
                       break;
                default:
                    break;
                }

}
        
        
        
        
        








    }




})();