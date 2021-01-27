(function() {
  'use strict';
  angular
    .module('squidles')
    .controller('SquidlesController', SquidlesController)

  SquidlesController.$inject = ['$rootScope', '$scope', '$state', '$interval', 'squidles', 'stores', 'time', 'params', 'history', '$ionicPopup', '$ionicListDelegate', 'profiles', '$timeout'];


  function SquidlesController($rootScope, $scope, $state, $interval, squidles, stores, time, params, history, $ionicPopup, $ionicListDelegate, profiles, $timeout) {

    var self = this;




    $scope.$on('$ionicView.beforeEnter', function() {
      activate();
    });





    $scope.$on('$destroy', function() {

      if (self.timer) {
        $interval.cancel(self.timer);
      }
    });


    self.goToSquidle = goToSquidle;
    self.countDown = countDown;
    self.startTimer = startTimer;
    self.createSquidle = createSquidle;



    ////////////////////////////////////////

    function activate() {

      self.list = self.list ? self.list : [];
      self.listIds = self.listIds ? self.listIds : {};


        stores.read('profiles').then(readSquidles);


      ////////////////////

      function readSquidles(profileData) {

        angular.forEach(self.list, function(value, key) {
          if (time.remaining(value.expiresAt) <= 0) {

            stores.remove('squidles', value.id,undefined,{silent:true});
            removeSquidleFromList(value.id);

          }
        });

        squidles.read().then(function(data) {

          angular.forEach(data, function(value, key) {
            var s = {};
            s.username = value.op;
            s.description = value.challenge.text.value;
            s.id = value.short;
            s.avatar = profileData[value.op].avatar;
            s.name = profileData[value.op].name;
            s.sent = value.sent;
            s.hasAttachment = 'video' in value.challenge || 'photo' in value.challenge;
            s.alreadyAnswered = 'prize' in value;
            s.expiresAt = value.expiresAt;
            s.timeRemaining = time.remaining(value.expiresAt);


            if (s.timeRemaining <= 0) {

              stores.remove('squidles', s.id,undefined,{silent:true});

              removeSquidleFromList(s.id);



            } else {

              if (self.listIds[s.id] == undefined) {
                self.list.push(s);
                self.listIds[s.id] = self.list.length - 1;
              } else {
                Object.assign(self.list[self.listIds[s.id]], s);
              }
            }



          });



          self.startTimer();
        });


      }





    }

    function createSquidle() {
      $ionicPopup.alert({
        title: "Glad you like Squidler!",
        template: "Please send us a message via the help section in the menu to request an invite to download the full app",
        okType: "button-positive"
      }).then(function(){
        $state.go('main.help');
      });
    }

    function goToSquidle(short) {

      $state.go('main.squidle', {
        squidleId: short
      });

    }






    function countDown(timeRemaining) {

      return time.hourMinSec(timeRemaining).string


    }



    function startTimer() {

      self.timer = self.timer ? self.timer : $interval(function() {

        angular.forEach(self.list, function(value, key) {

          value.timeRemaining -= 1;

          if (value.timeRemaining <= 0) {

            removeSquidleFromList(value.id);

            stores.remove('squidles', s.id,undefined,{silent:true});

          }

        });





      }, 1000);

    }








    function removeSquidleFromList(short) {

      if (self.listIds[short] != undefined) {
        self.list.splice(self.listIds[short], 1);
        self.listIds = {};

        angular.forEach(self.list, function(value, key) {
          self.listIds[value.id] = key;
        });
      }

    }






  }






})();
