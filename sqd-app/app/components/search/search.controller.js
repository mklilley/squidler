(function () {

     angular
            .module("sqd")
            .controller("SearchController",SearchController)

    SearchController.$inject = ["$rootScope","$scope",'$ionicScrollDelegate', '$ionicLoading', '$ionicPopup', 'googleImages'];


    function SearchController($rootScope,$scope,$ionicScrollDelegate, $ionicLoading, $ionicPopup, googleImages){

        var self = this;

        self.image={};
        self.index=1;
        self.query = "";
        self.previousQuery="";
        self.thumbs = [];
        self.keyboardUp = false;
        
        self.submitSearch = submitSearch;
        self.searchChanged = searchChanged;
        self.imageSelect = imageSelect;
        
         window.addEventListener('native.keyboardshow', function() {

    self.keyboardUp = true;
                         
  });
        
         window.addEventListener('native.keyboardhide', function() {
           
             
    self.keyboardUp = false;
             
  });
        
        ////////////////////
        
        
        function submitSearch(){
            
            if(self.searchForm.$valid){
           
            $ionicLoading.show();
            
            self.thumbs = searchChanged() ? [] : self.thumbs;
            
            self.previousQuery = self.query;
        
            googleImages.read(self.query, self.index).then(function(data){
            self.index = data.nextPageIndex;
                self.thumbs = self.thumbs ? data.results.concat(self.thumbs) : data.results;
            $ionicLoading.hide(); $ionicScrollDelegate.scrollTop(true);
                $ionicScrollDelegate.resize();
                
            });
            }
            
            else{
             $ionicPopup.alert({
     title: "Empty search field",
                 okType: "button-assertive"
   });
            }
        
        }



        function imageSelect(item) {

              var img = {
                  thumb: item.thumb,
                  url: item.url,
                  from: 'link',
                  type: 'image'
              };



              self.select({
                  id: self.id,
                  img: img
              });


          }
        
        function searchChanged(){
        
        return !(self.query == self.previousQuery);
        
        }

          this.back = function(){
              this.clear();
              $scope.search.sqdInput.query.data="";
              $scope.search.changed = false;
          $scope.toggle = false;
          }

          this.clear = function(){
                  $scope.search.thumbs = [];
        $scope.search.startIndex=1;

         $scope.search.query = {
                         key: "AIzaSyDuQkoOtI820lE9iKEvzyyGvYfRa-z2MFE",
                        cx:" 004657510724817787166:jk7v1d__46y",
                        q:"",
              searchType:"image"
                }
          }

$rootScope.$on("input-cleared",function(event,args){

    if (args.label=="query"){
/*        $scope.search.thumbs = [];
        $scope.search.startIndex=1;

         $scope.search.query = {
                        key: "AIzaSyDuQkoOtI820lE9iKEvzyyGvYfRa-z2MFE",
                        cx:"004657510724817787166:jk7v1d__46y",
                        q:"",
              searchType:"image"
                }*/
        $scope.search.changed = true;


    }

})

$rootScope.$on("input-changed",function(event,args){

    if (args.label=="query"){
/*        $scope.search.thumbs = [];
        $scope.search.startIndex=1;

         $scope.search.query = {
                        key: "AIzaSyDuQkoOtI820lE9iKEvzyyGvYfRa-z2MFE",
                        cx:"004657510724817787166:jk7v1d__46y",
                        q:"",
              searchType:"image"
                }*/

         $scope.search.changed = true;


    }

})

                 $scope.$on("hide-errors",function(){
                    $scope.search.empty=false;
                    });



        }





})();