(function () {
    'use strict';
    angular
        .module('share')
        .config(config);

    config.$inject = ['$stateProvider', '$sceProvider', '$compileProvider'];

    function config($stateProvider, $sceProvider, $compileProvider) {

        $stateProvider
                          .state('main.share', {
    url: "/share/:squidleId",
                views: {
                    main: {
                        templateUrl: 'app/components/share/share.html',
                        controller: 'ShareController as share'
                    }
                },
            resolve: {
                canModify: canModify
                }
            });
        
                 $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|sms|mailto|twitter|whatsapp|file):/);


    }
    
    canModify.$inject = ['squidles', '$stateParams', '$q'];

    function canModify(squidles, $stateParams, $q) {
        return squidles.read({
            short: $stateParams.squidleId
        }).then(function (data) {
            
            if(data.sent){
                
                return $q.resolve(data.sent);
               //return resources.read('squidles','http://old.squidler.com/api/v1/squidles/canmodify',$stateParams.squidleId)
            }
            
            else{
                return $q.resolve(data.sent);
            }
            

            

        });
    }
    



})();
