(function () {
'use strict';
    angular
            .module('stats')
            .controller('StatsController',StatsController)

    StatsController.$inject = ['$scope','$state','$stateParams','$ionicPopup','$ionicPlatform','$ionicLoading','squidles', '$interval','statistics','profiles','$cordovaNetwork'];


    function StatsController($scope,$state,$stateParams,$ionicPopup,$ionicPlatform,$ionicLoading,squidles,$interval,statistics,profiles,$cordovaNetwork){
        
        var self = this;
        
        self.short = $stateParams.squidleId;
        self.players = [];
        self.canRefresh = true;
        
        self.refresh = refresh;
        

        
        activate();
        
           $scope.$on('$destroy', function() {
         
         if(self.interval){
$interval.cancel(self.interval);}
        });
        

        
        
        
        ////////////////////////////////////////
        
        function activate(){
            
            
            squidles.read({short:self.short}).then(processStats);
            
            self.refresh();
            
        
            self.interval = self.interval ? self.interval :  $interval(refresh,10000);
                


        }
        

        
        
        
        function refresh() {

            try {
                $ionicPlatform.ready(function () {

                    if ($cordovaNetwork.isOnline()) {
                        doRefresh();
                        self.canRefresh = true;

                    }
                    else{
                        self.canRefresh = false;
                    }

                });
            } catch (err) {
                doRefresh();

            }



            ////////////////

            function doRefresh() {

                $ionicLoading.show();

                statistics.read(self.short).then(function (squidle) {

                    processStats(squidle);
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');

                }).catch(function () {
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');

                });

            }


        }
        
         function processStats(squidle){
             
             profiles.read().then(function(profileData){
                 
              self.players = squidle.stats.players;
             self.summary = squidle.stats.summary;
             
             angular.forEach(self.players, function(player,index){
   
                 self.players[index].avatar = profileData[player.username].avatar;
                 self.players[index].first_name = profileData[player.username].first_name;
                 
             });
                 
                 
             });
 

                
            
          
        
        }
        
        
            
            

            
            
        }
        
            
        
    
        


        
        

 


    




})();