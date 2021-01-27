(function () {
'use strict';
    angular
            .module('squidles')
            .controller('SquidleController',SquidleController)

    SquidleController.$inject = ['$scope', '$rootScope', '$state', 'squidles', 'stores', '$stateParams','$ionicLoading', '$ionicSlideBoxDelegate', '$ionicModal', '$ionicPopup', '$ionicHistory', 'time', '$interval', '$timeout', '$ionicPlatform', '$cordovaClipboard','$ionicScrollDelegate'];


    function SquidleController($scope, $rootScope, $state, squidles, stores, $stateParams, $ionicLoading, $ionicSlideBoxDelegate, $ionicModal, $ionicPopup, $ionicHistory, time, $interval, $timeout, $ionicPlatform, $cordovaClipboard,$ionicScrollDelegate){

        var self = this;

        self.data = {};
        self.guess = "";

        self.alreadyAnswered = false;
        self.prizeDisplayed = false;
        self.validGuess = true;
        self.adjustForIos = ionic.Platform.isIOS() ? {top:'20px'}:{top:'20px'};

        self.toggleSwipe = toggleSwipe;
        self.makeGuess = makeGuess;
        self.createSquidle = createSquidle;
        self.showPrize = showPrize;
        self.processSquidle = processSquidle;
        self.slideHasChanged = slideHasChanged;
         self.countDown = countDown;
        self.startTimer = startTimer;
        self.lock = lock;
        self.copyText = copyText;
        self.resetFullScreenImage = resetFullScreenImage;


     $scope.$on('$destroy', function() {

         if(self.timer){
$interval.cancel(self.timer);}
        });

  $ionicModal.fromTemplateUrl('app/components/squidles/fullscreenModal.html', {
    scope: $scope
  }).then(function(modal) {
    self.fullscreen = modal;
  });

          self.openFullscreen = function() {
   self.fullscreen.show();
  };


 self.closeFullscreen = function() {
   self.fullscreen.hide().then(function(){

       self.resetFullScreenImage();


   });

  };

  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    self.fullscreen.remove();

      window.removeEventListener('native.keyboardshow', keyboardShow);

        window.removeEventListener('native.keyboardhide', keyboardHide);
  });









        activate();

        ////////////////////////////////////////

        function toggleSwipe(bool){

          $ionicSlideBoxDelegate.enableSlide(bool);

        }

        function activate(){


            if($stateParams.squidleId=="preview"){

                stores.read('preview').then(function(preview){

                    self.isPreview = true;

                    self.data = preview.squidle;
                    self.guess = preview.squidle.answer.text.value;
                   self.answerHeight = calcAnswerHeight();

                    self.toggleSwipe(self.isPreview);

                });

            }

        else{

              window.addEventListener('native.keyboardshow', keyboardShow);
          window.addEventListener('native.keyboardhide', keyboardHide);

             self.guess = "";


            $ionicLoading.show();
            squidles.read({short:$stateParams.squidleId}).then(function(squidle){

                $ionicLoading.hide();

                var timeRemaining = time.remaining(squidle.expires_at);

                if(timeRemaining<=0){

                    squidleExpired();

                }

                else{

                     self.data = angular.copy(squidle);

                     self.answerHeight = calcAnswerHeight(self.data.answer.text.hint);

                                    if(self.data.prize){
                    self.alreadyAnswered = true;



                }
            else{
             self.data.timeRemaining = timeRemaining;

                self.startTimer();



            }


                }




             self.isPreview = false;

self.toggleSwipe(self.alreadyAnswered);

            }).catch(function(){

                $ionicHistory.nextViewOptions({
  historyRoot: true
});
                         $state.go('main.squidles');
            });

            }

        }

                  function keyboardShow(){
              if(ionic.Platform.isIOS()){
               self.keyboardShow=true;}
          }

        function keyboardHide(){
            if(ionic.Platform.isIOS()){
            self.keyboardShow=false;}

        }

        function makeGuess(){

            if(self.squidleForm.$valid){

            $ionicLoading.show();

                var guessData = {
                    short:$stateParams.squidleId,
                    guess:self.guess

                }
            squidles.read(guessData).then(postProcess).catch(showError)

            }

            else{
            $ionicPopup.alert({
     title: "Empty guess",
                 okType: "button-assertive"
   });
            }

            return

            ////////////////////////////////////////

            function postProcess(response){

                $ionicLoading.hide();

                self.validGuess = true;

                $interval.cancel(self.timer);

                if(response.prize){

                self.alreadyAnswered = true;
                    self.data.prize = response.prize;
                $ionicSlideBoxDelegate.next();
                self.toggleSwipe(self.alreadyAnswered);
                    self.pause = true;
                    $scope.$broadcast('pause');
                }
                else{
                 self.validGuess = false;
                     $ionicPopup.alert({
     title: ":-( Wrong Answer",
                          okType: "button-assertive"
   });
                }



            }

            function showError(){

                $ionicLoading.hide();

                 $ionicPopup.alert({
     title: "Something went wrong, sorry"
   });


            }


        }

        function createSquidle(){

        $state.go('main.create');

        }

       function showPrize(){

       $ionicSlideBoxDelegate.next();
           self.prizeDisplayed = true;

        }

        function processSquidle(){

            $ionicHistory.goBack();
            $scope.$on('$ionicView.afterLeave', function(){
            $rootScope.$broadcast('processSquide');

            });

        }

        function slideHasChanged(index){
            self.prizeDisplayed = index==1 ? true : false;
            $scope.$broadcast('pause');

        }

       function countDown(timeRemaining) {

            return time.hourMinSec(timeRemaining).string


        }

                function startTimer() {

            self.timer = self.timer ? self.timer : $interval(function () {



                    self.data.timeRemaining -= 1;

                    if (self.data.timeRemaining <= 0) {



                    squidleExpired();



                    }




            }, 1000);

        }

        function squidleExpired(){

             stores.remove('squidles', $stateParams.squidleId);

                                    self.outOfTime = $ionicPopup.alert({
     title: "Sorry, you've run out of time :-(",
                 okType: "button-assertive"
   });

                            self.outOfTime.then(function(){
                            $ionicHistory.nextViewOptions({
  historyRoot: true
});
                         $state.go('main.squidles');
                         });

                          $timeout(function() {
     self.outOfTime.close();
     $ionicHistory.nextViewOptions({
  historyRoot: true
});
                         $state.go('main.squidles');
  }, 2000);

                        $interval.cancel(self.timer);

        }


        function lock(){


            stores.remove('squidles',$stateParams.squidleId,['prize'])

            self.alreadyAnswered = false;
            self.toggleSwipe(false);

            activate();

        }



        function copyText(text){


          try{  $ionicPlatform.ready(function() {

  $cordovaClipboard
    .copy(text)
    .then(function () {
                       $ionicPopup.alert({
     title: 'Text copied :-)',
                            okType: "button-assertive"
   });
    }, function () {
                       $ionicPopup.alert({
     title: 'Failed to copy text :-(',
                           okType: "button-assertive"
   });
    });

}); }
            catch(err){
             $ionicPopup.alert({
     title: 'Failed to copy Text :-(',
                 okType: "button-assertive"
   });

            }





        }

        function calcAnswerHeight(text){

            var style;

            if(text && text!=""){

                var numLines = (text.length / 15 >> 0) + 1;
                var ems = Math.max(numLines*1.25, 2.5);

              style= {height: ems.toString() + 'em'};

            }
            else {
                style = {height:'2.5em'};
            }

            return style

        }

        function resetFullScreenImage(){

        $ionicScrollDelegate.$getByHandle('fullScreenImage').zoomTo(1);
     $ionicScrollDelegate.$getByHandle('fullScreenImage').scrollTop();

        }





    }




})();
