(function () {
    'use strict';
    angular
        .module('sqd')
        .controller('SqdController', SqdController)

    SqdController.$inject = ['$state', '$scope', 'stores', 'params'];


    function SqdController($state, $scope, stores, params) {

        var self = this;

        self.seenWalkthrough = {};
        self.activeWalkthrough = {};
        self.createText = params.walkthroughs().create;
        self.squidlesText = params.walkthroughs().squidles;


        self.setSeenWalkthrough = setSeenWalkthrough;

        stores.read('usageData', 'walkthroughs').then(function (walkthroughs) {

            self.seenWalkthrough.create = walkthroughs.create ? true : false;

            self.seenWalkthrough.squidles = walkthroughs.squidles ? true : false;
        });

        $scope.$on('showWalkthrough', function (event, label) {

            self.activeWalkthrough[label] = true;


        });


        ////////////////////////////



        function setSeenWalkthrough(label) {
            var walk = {};
            walk[label] = true;
            stores.update('usageData', 'walkthroughs', walk);

            self.seenWalkthrough[label] = true;


            self.activeWalkthrough = {};


        }



    }




})();