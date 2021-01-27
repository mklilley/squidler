(function () {
    'use strict';
    angular
        .module('sqd')
        .provider('statistics', statisticsProvider);

    statisticsProvider.$inject = [];

    function statisticsProvider() {

        var api;
        
        statisticsService.$inject = ['$q', 'resources', 'stores', 'profiles'];

        var provider = {

            setApi: setApi,
            $get: statisticsService


        };

        return provider;


        ////////////////////////////////////////

        function setApi(url) {

            api = url;

        }



        
        
        /**
         * @ngdoc service
         * @name sqd.service:statistics
         * @param {object} $q Angular promise service
         * @param {object} resources Service to communicate with backend resources 
         * @param {object} stores Service used to interface with the html5 local storage
          * @param {object} profiles Retrives the public profile for a specific user 
         * @example
         *
         * @returns {object} Service object exposing methods - read
         *
         * @description
         * This is a service that is returned as part of statisticsProvider. Used to retrieve a statistics information on a particular Squidle
         */

        function statisticsService($q, resources, stores, profiles) {

        var service = {

            read: read

        };

        return service;



        ////////////////////////////////////////

        /**
         * @ngdoc method
         * @name read 
         * @methodOf  sqd.service:statistics
         * @param {string} short Short link id of the squidle
         * @returns {promise} Resolves to an object with keys 'summary' (summary stats on squidle) and 'players' (an array with player specific stats)
         * 
         * @description Retrieves the Squidle stats 
         * @example
         * <pre>statistics.read('F36SAb6')</pre>
         * 
         */

        function read(short) {
            
            var deferred = $q.defer();
            
            
            readFromServer().then(updateStats).catch(error);        
                          

            return deferred.promise;

            ////////////////////////////////////////
            
            function readFromServer(){
                
                var stats = {},
                    proms = [];
                
                stats.summary = {
                    
                    attempts:10,
                    solves:1
                    
                };
                
                stats.players = [
                    {username:'bieira',
                    attempts:6,
                    solved:true},
                    {username:'colourblock',
                    attempts:4,
                    solved:false}
                ];
                
                angular.forEach(stats.players, function(player, index){
                    
                    var username = player.username;
                    
                     proms.push(profiles.read(username));
                    
                    
                });
                
                                               
             
                
                return $q.all(proms).then(function(){
                    
                    return $q.when(stats);
                    
                });
                
                
                ////////////////////////////////////////
                
/*                function postProcess(profiles){
                    
                     angular.forEach(profiles, function(profile, index){
                    
                    stats.players[index].avatar = profile.avatar;
           
                         
                      
                    
                    
                });
                    
                    return $q.when(stats);
                    
                    
                }*/
                
                
                
            }
                
                
            
            function updateStats(stats){
                
                return stores.update('squidles',short,{stats:stats}).then(function(squidle){
                    
                    deferred.resolve(squidle);
                    
                });
                
            }
            
            function error(){
                
                deferred.reject();
                
                
            }



        }







    }



    }



})();