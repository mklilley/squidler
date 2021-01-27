(function () {
    'use strict';
    angular
        .module('squidles')
        .controller('SquidleController',SquidleController)

    SquidleController.$inject = ['$scope', '$rootScope', '$state', 'squidles', 'stores', '$stateParams','$ionicLoading', '$ionicSlideBoxDelegate', '$ionicModal', '$ionicPopup', '$ionicHistory', 'time', '$interval', '$timeout', '$ionicPlatform', '$cordovaClipboard','$ionicScrollDelegate', '$q'];


    function SquidleController($scope, $rootScope, $state, squidles, stores, $stateParams, $ionicLoading, $ionicSlideBoxDelegate, $ionicModal, $ionicPopup, $ionicHistory, time, $interval, $timeout, $ionicPlatform, $cordovaClipboard,$ionicScrollDelegate, $q){

        var self = this;

        self.data = {};


        self.alreadyAnswered = false;
        self.prizeDisplayed = false;
        self.validGuess = true;
        self.adjustForIos = ionic.Platform.isIOS() ? {top:'20px'}:{};
        self.fullScreen = {height:(window.innerHeight-96)+"px",
            position:"relative"};




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
        self.getHint = getHint;
        self.report = report;


        $scope.$on('$destroy', function() {

            if(self.timer){
                $interval.cancel(self.timer);}
        });

        $scope.$on('submit-guess', function() {

            self.makeGuess();
        });

        $ionicModal.fromTemplateUrl('app/components/squidles/fullscreenModal.html', {
            scope: $scope
        }).then(function(modal) {
            self.fullscreen = modal;
        });

        self.openFullscreen = function() {
            self.fullscreen.show();
            self.fullScreenOpen = true;
        };


        self.closeFullscreen = function() {
            self.fullscreen.hide().then(function(){
                self.fullScreenOpen = false;
                self.resetFullScreenImage();


            });

        };

        //Cleanup the popup when we're done with it!
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
                    self.answerHeight = calcAnswerHeight(self.guess);

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

                    $stateParams.squidleId = squidle.short;

                    var timeRemaining = time.remaining(squidle.expiresAt);

                    if(timeRemaining<=0){

                        squidleExpired();

                    }

                    else{

                        self.data = angular.copy(squidle);

                        self.answerHeight = calcAnswerHeight(self.data.answer.text.value);

                        self.noMoreHints = self.data.answer.text.value.indexOf("\u005F") == -1 ? true : false;

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
                    $state.go('welcome');
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
                squidles.read(guessData).then(postProcess).catch(severDownOrSquidleDeleted);

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



            function severDownOrSquidleDeleted(error) {

                if(error.details.status === 404){
                    $interval.cancel(self.timer);
                    stores.remove('squidles', $stateParams.squidleId).then(function () {

                        $ionicHistory.nextViewOptions({
                            historyRoot: true
                        });
                        $state.go('welcome');

                    });
                }

            }



        }

        function createSquidle(){

            $ionicPopup.confirm({
                title: "Glad you like Squidler!",
                template: "To create your own Squidles you'll need to download our FREE app",
                okType: "button-energized"
            }).then(function(res){
                if(res) {
                    // $ionicPopup.alert({
                    //     title: "Coming very soon!",
                    //     template: "Squidler will be available from Google Play and the App Store in a couple of weeks",
                    //     okType: "button-energized"
                    // });

                    if (ionic.Platform.isIOS()) {
                        window.open('https://itunes.apple.com/us/app/squidler/id1133896864?ls=1&mt=8', '_system', 'location=yes');
                    }
                    else if (ionic.Platform.isAndroid()) {
                        window.open('https://play.google.com/store/apps/details?id=com.squidler', '_system', 'location=yes');
                    }
                    else {
                        $ionicPopup.alert({
                            title: "Sorry",
                            template: "Squidler is only currently available for Android and iOS",
                            okType: "button-assertive"
                        })
                    }


                }


            });

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
                $state.go('welcome');
            });

            $timeout(function() {
                self.outOfTime.close();
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                $state.go('welcome');
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

                var numLines = (text.length / 17 >> 0) + 1;
                var ems = Math.max(numLines, 2.5);

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


        function getHint() {

            $ionicPopup.confirm({
                title: "Glad you like Squidler!",
                template: "To get hints you'll need to download our FREE app",
                okType: "button-energized"
            }).then(function(res){
                if(res) {

                    // $ionicPopup.alert({
                    //     title: "Coming very soon!",
                    //     template: "Squidler will be available from Google Play and the App Store in a couple of weeks",
                    //     okType: "button-energized"
                    // });

                    if (ionic.Platform.isIOS()) {
                        window.open('https://itunes.apple.com/us/app/squidler/id1133896864?ls=1&mt=8', '_system', 'location=yes');
                    }
                    else if (ionic.Platform.isAndroid()) {
                        window.open('https://play.google.com/store/apps/details?id=com.squidler', '_system', 'location=yes');
                    }
                    else {
                        $ionicPopup.alert({
                            title: "Sorry",
                            template: "Squidler is only currently available for Android and iOS",
                            okType: "button-assertive"
                        })
                    }


                }
            });

        }



        function report(){
            $state.go('main.help',{message:"Inappropriate content on Squidle with id "+$stateParams.squidleId});
        }





    }




})();
