(function () {

     angular
            .module("sqd")
            .controller("FullScreenTextController",FullScreenTextController)

    FullScreenTextController.$inject = ["$rootScope", "$scope", "$ionicPopup",'$timeout'];


    function FullScreenTextController($rootScope, $scope, $ionicPopup,$timeout){

        var self = this;

        self.tapBlock = true;
        self.maxCharacters = 139;
        self.adjustForIos = ionic.Platform.isIOS() ? {top:'20px'}:{};

        self.charactersRemaining = charactersRemaining;
        self.done =  done;



        ////////////////////

        function charactersRemaining(){

            //var text = typeof self.data === 'object' ? self.data.text : data;
            var text = self.form[self.id].$viewValue;
            var remaining = self.maxCharacters - text.length;


            return remaining

        }

        function done(){

            if(self.form[self.id].$error.maxlength){


                        $ionicPopup.alert({
     title: "Too many characters"
   });
            }
            else{

              self.tapBlock = true;


                  self.hide({
                    id: self.id
                    });

/*           $timeout( function(){

                    self.hide({
                    id: self.id
                    });

                 }, 300);*/

            }




        }




        }





})();
