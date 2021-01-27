(function () {

     angular
            .module("sqd")
 .controller("SqdInputController",SqdInputController)

    SqdInputController.$inject = ["$scope"];


    function SqdInputController($scope){


            $scope.clickAction = clickAction;
        $scope.validateForm = validateForm;

        
        activate();

            
            ////////////////////////////////////////
        
        function activate(){
        
            $scope.text = typeof $scope.model === 'object' ? $scope.model.text : $scope.model;
            
        }
            
                        function clickAction(){
          if($scope.focus && $scope.ngReadonly=="false"){
            $scope.text = "";
            if($scope.form){
            $scope.form[$scope.name].$setDirty();
            }
                        }
                
                return;
                
            }
        
        function validateForm(){

             if($scope.form && $scope.text != ""){
            $scope.form[$scope.name].$validate();
            }
            
        }
        




}


})();