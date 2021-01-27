(function () {
    'use strict';
    angular
        .module('settings')
        .controller('SettingsController', SettingsController)

    SettingsController.$inject = ['$scope', '$rootScope','$state', '$ionicLoading', 'stores'];


    function SettingsController($scope, $rootScope, $state, $ionicLoading, stores) {

        var self = this;

        self.logout = logout;



        ////////////////////

        
        function logout(){
            
           stores.remove().then(function(){

                       stores.create('tempSquidle', 'prize', {
            text: ""
        });
        stores.create('tempSquidle', 'challenge', {
            text: ""
        });
        stores.create('tempSquidle', 'answer', {
            text: ""
        });

        stores.create('preview', 'squidle', {});

        stores.create('profiles','SquidlerTeam',{bio:"We Love to Squidle",avatar:"",first_name:"Squidler Team",location:"London"});
        
        stores.create('squidles');


        
        stores.create('usageData','opens',{});
        stores.create('usageData','walkthroughs',{squidles:false,create:false});
        stores.create('usageData','timeLastOpen',{}).then(function(){
            
                     $rootScope.alreadyOpen = false;
$rootScope.$broadcast('reset');
        });

               
           });
            


            
    
            
            
            

            
      
            
            
            
        }
        
    
        






        



    }




})();