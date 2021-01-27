(function () {
    'use strict';
    angular
        .module('squidles')
        .controller('SquidlesController', SquidlesController)

    SquidlesController.$inject = ['$rootScope','$scope', '$state', '$interval', 'squidles', 'stores', 'time', 'params', 'history', '$ionicPopup','$ionicListDelegate', 'profiles','$timeout'];


    function SquidlesController($rootScope,$scope, $state, $interval, squidles, stores, time, params, history, $ionicPopup,$ionicListDelegate, profiles,$timeout) {

        var self = this;




 $scope.$on('$ionicView.beforeEnter', function() {
  activate();
});
         $scope.$on('$ionicView.beforeLeave', function() {

            self.hideAllOptions();
});




   $scope.$on('$destroy', function() {

         if(self.timer){
$interval.cancel(self.timer);}
        });


        self.goToSquidle = goToSquidle;
        self.shareSquidle = shareSquidle;
        self.countDown = countDown;
        self.startTimer = startTimer;
        self.createSquidle = createSquidle;
        self.refresh = refresh;
        self.deleteSquidle = deleteSquidle;
        self.hideAllOptions = hideAllOptions;
        self.statsOnSquidle = statsOnSquidle;


        ////////////////////////////////////////

        function activate() {

            self.list = self.list ? self.list : [];
            self.listIds = self.listIds ? self.listIds : {};
            self.defaultAvatar = params.squidles().defaultAvatar;
            self.firstTime = false;


            stores.read('usageData','walkthroughs').then(function(walkthroughs){


                          $timeout(function () {

     $rootScope.$broadcast('showWalkthrough','squidles')

                    },1000);


                });

            stores.read('profiles').then(readSquidles);


            ////////////////////

            function readSquidles(profileData){

                squidles.read().then(function (data) {

                angular.forEach(data, function (value, key) {
                    var s = {};
                    s.username = value.op;
                    s.description = value.challenge.text.value;
                    s.id = value.short;
                    s.avatar = profileData[value.op].avatar;
                    s.first_name = profileData[value.op].first_name;
                    s.sent = value.sent;
                    s.hasAttachment = 'video' in value.challenge || 'photo' in value.challenge;
                    s.alreadyAnswered = 'prize' in value;
                    s.timeRemaining = time.remaining(value.expires_at);


                    if (s.timeRemaining <= 0) {

                    stores.remove('squidles', s.id);

                    removeSquidleFromList(s.id);



                    }

                    else{

                      if(self.listIds[s.id]==undefined){
                        self.list.push(s);
                        self.listIds[s.id] = self.list.length-1;
                      }
                        else{
                        //  self.list[self.listIds[s.id]] = s;
                        }
                    }



                });


                if(self.list.length==0){
                    stores.read('usageData','opens').then(function(opens){

                        self.firstTime = opens.number==1 ? true : false;
                });

                }

                self.startTimer();
            });


            }





        }

        function createSquidle () {
            $state.go('main.create');
        }

        function goToSquidle(short) {

            $state.go('main.squidle', {
                squidleId: short
            });

        }

        function shareSquidle(short) {


            $state.go('main.share', {
                squidleId: short
            });

        }

        function deleteSquidle(squidle){

            var short = squidle.id,
                text = squidle.sent ? 'You are about to delete your Squidle everywhere across the world.' : 'You are about to delete this Squidle from your phone.'


        var confirmPopup = $ionicPopup.confirm({
     title: 'Delete Squidle',
     template: text,
    okType: "button-energized"
   });
   confirmPopup.then(function(res) {
     if(res) {

       squidles.remove(squidle).then(function(){

         removeSquidleFromList(short);

       });
     } else {

     }
   });


        }



        function countDown(timeRemaining) {

            return time.hourMinSec(timeRemaining).string


        }



        function startTimer() {

            self.timer = self.timer ? self.timer : $interval(function () {

                angular.forEach(self.list, function (value, key) {

                    value.timeRemaining -= 1;

                    if (value.timeRemaining <= 0) {

                        removeSquidleFromList(value.id);

                        stores.remove('squidles', value.id);

                    }

                });





            }, 1000);

        }

        function refresh(){

            var options = {refreshAll:true};

            history.read(options).then(function(){
              self.list = [];
              self.listIds = {};
             activate();
                 $scope.$broadcast('scroll.refreshComplete');
            }).catch(function(){
                $scope.$broadcast('scroll.refreshComplete');

            });

        }



        function hideAllOptions(){
            $ionicListDelegate.closeOptionButtons();
            $scope.$broadcast('closeOptions');
        }

        function statsOnSquidle(short){

            $state.go('main.stats', {
                squidleId: short
            });


        }

        function removeSquidleFromList(short){

          if(self.listIds[short]!=undefined){
          self.list.splice(self.listIds[short],1);
          self.listIds={};

          angular.forEach(self.list,function(value,key){
            self.listIds[value.id]=key;
          });
        }

        }






    }






})();
