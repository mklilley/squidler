(function () {

     angular
            .module("sqd")
 .controller("SqdNumberController",SqdNumberController)

    SqdNumberController.$inject = ["$scope"];


    function SqdNumberController($scope){
        
        var self = this;
        

            $scope.increase = increase;
        $scope.decrease = decrease;
        
        activate();
        



            
            ////////////////////////////////////////
        
        function activate(){
            
            self.max = parseInt($scope.max);
            self.min = parseInt($scope.min);
            self.step = parseInt($scope.step);
            
            
        }
        
         
        function increase(){
            
            $scope.model = ($scope.model+self.step) >= self.max ? self.max : $scope.model+self.step;

            
        }
        
                function decrease(){
            
            $scope.model = ($scope.model-self.step) <= self.min ? self.min : $scope.model-self.step;
            
        }
        




}


})();