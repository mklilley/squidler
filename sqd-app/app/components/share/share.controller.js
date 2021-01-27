(function () {
'use strict';
    angular
            .module('share')
            .controller('ShareController',ShareController)

    ShareController.$inject = ['$state','$stateParams','$ionicPopup','$ionicPlatform','$ionicLoading','$cordovaClipboard', '$cordovaSocialSharing','squidles','time','canModify'];


    function ShareController($state,$stateParams,$ionicPopup,$ionicPlatform,$ionicLoading,$cordovaClipboard, $cordovaSocialSharing,squidles,time,canModify){

        
        var self = this;
        
        self.short = $stateParams.squidleId;
        self.url = "https://dev.squidler.com/#!/"+self.short;
        self.isIOS = ionic.Platform.isIOS();
        self.smsLink = self.isIOS ? "sms:12345678&body="+self.url : "sms:?body="+self.url;
        self.allowed = {};
        self.canModify = canModify;
        
        self.copyShortLink = copyShortLink;
        self.goToSquidle = goToSquidle;
        self.updateExpiry = updateExpiry;
        self.updateHint = updateHint;
        self.expiryChanged = expiryChanged;
        self.viaFacebook = viaFacebook;
        self.viaTwitter = viaTwitter;
        self.viaEmail = viaEmail;
        self.viaSMS = viaSMS;
        self.viaWhatsapp = viaWhatsapp;
        self.viaOther = viaOther;
        self.computeExpiry = computeExpiry;
        
        activate();
        

        
        
        
        ////////////////////////////////////////
        
        function activate(){
            
            

            squidles.read({short:self.short}).then(function(data){
            
                self.squidle = data;
                self.hint = data.answer.text.hint.length>0 ? true : false;
                self.ownSquidle = data.sent;
                
                
                self.hourMinSec = time.hourMinSec(time.remaining(data.expires_at));
                
                self.hours=self.hourMinSec.array[0];
                self.mins=self.hourMinSec.array[1];
                              
                
            });
            try {
            canShareVia('facebook');
            canShareVia('whatsapp');
            canShareVia('twitter');}
            catch(err){}
            
/*           try {self.allowed.facebook = 
            self.allowed.whatsapp = canShareVia('whatsapp');
            self.allowed.twitter = }
            catch(err) {}
        */
            
            
        }
        
            
        
        function copyShortLink(){
            
          try{  $ionicPlatform.ready(function() {
                
  $cordovaClipboard
    .copy(self.url)
    .then(function () {
                        self.alertPopup = $ionicPopup.alert({
     title: 'Squidle link copied :-)',
                            okType: "button-assertive"
   });
    }, function () {
                       self.alertPopup = $ionicPopup.alert({
     title: 'Failed to copy Squidle link :-(',
                           okType: "button-assertive"
   });
    });
                
}); }
            catch(err){
             self.alertPopup = $ionicPopup.alert({
     title: 'Failed to copy Squidle link :-(',
                 okType: "button-assertive"
   });
            }


        }
        
        function goToSquidle(){
            
            $state.go('main.squidle', { squidleId: self.short });
        
        }
        
        function updateExpiry(){
            
            computeExpiry();
            
            $ionicLoading.show();
            
            var squidle = {
                short: self.squidle.short,
                expires_at: {
                    interval:'minute',
                    units:self.expiry
                }
            };
            

        squidles.update(squidle,'expiry').then(function(){
        $ionicLoading.hide();
            activate();
        });
   
        }
        
        function updateHint(){
            
             $ionicLoading.show();
            
            var squidle = {
                short: self.squidle.short,
                answer: self.squidle.answer,
                hintOn: self.hint
            }
            
            self.squidle.hintOn = self.hint;    
             
              squidles.update(squidle,'hint').then(function(){
        $ionicLoading.hide();
        }).catch(function(){
              
              self.hint = !self.hint;
              });

        }
        
        function expiryChanged(){
        
            return (self.hourMinSec.array[0] != self.hours) || (self.hourMinSec.array[1] != self.mins);
        
        }
        
        function viaTwitter(){
        
        $ionicPlatform.ready(function() {
              $cordovaSocialSharing
    .shareViaTwitter(null, null, self.url)
    .then(function(result) {
      // Success!
    }, function(err) {
      // An error occurred. Show a message to the user
    });
                });
        
            
        }
        
        function viaFacebook(){
             $ionicPlatform.ready(function() {
                  $cordovaSocialSharing
    .shareViaFacebook(null, null, self.url)
    .then(function(result) {
      // Success!
    }, function(err) {
      // An error occurred. Show a message to the user
    });
             });
        }
        
        function viaWhatsapp(){
             $ionicPlatform.ready(function() {
                  $cordovaSocialSharing
    .shareViaWhatsApp(null, null, self.url)
    .then(function(result) {
      // Success!
    }, function(err) {
      // An error occurred. Show a message to the user
    });
             });
        }
        
        function viaEmail(){
             $ionicPlatform.ready(function() {
               $cordovaSocialSharing
    .shareViaEmail(self.url, null, null, null, null, null)
    .then(function(result) {
      // Success!
    }, function(err) {
      // An error occurred. Show a message to the user
    });
             });
        }
        
        function viaSMS(){
             $ionicPlatform.ready(function() {
               $cordovaSocialSharing
    .shareViaSMS(self.url, "")
    .then(function(result) {
      // Success!
    }, function(err) {
      // An error occurred. Show a message to the user
    });
             });
        }
        
        function viaOther(){
             $ionicPlatform.ready(function() {
                  $cordovaSocialSharing
    .share(null, null, null, self.url) // Share via native share sheet
    .then(function(result) {
      // Success!
    }, function(err) {
      // An error occured. Show a message to the user
    });
             });
        }
        
        function canShareVia(socialType){
            
self.allowed[socialType] = true;
            
             $ionicPlatform.ready(function() {
             
               $cordovaSocialSharing
    .canShareVia(socialType, null, null, null, self.url)
    .then(function(result) {
                self.allowed[socialType] = true;
    }, function(err) {
self.allowed[socialType] = false;
    });
             });
            
           
        
        }
        
        function computeExpiry(){
            
            self.expiry = self.hours*60 + self.mins;
        
            

        }
        

        
        

 


    }




})();