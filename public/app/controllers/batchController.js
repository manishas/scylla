define([
    "scyllaApp"
], function(
    scyllaApp
    ){
    return scyllaApp.controller("BatchController", function($scope, $http, Page) {
        Page.setFirstLevelNavId("batchesNav");
        $scope.batches = [];

        $http.get("/batches")
            .success(function(batches){
                         $scope.loaded = true;
                         $scope.batches = batches
                     })
            .error(function(err){
                       alert(err)
                   });
    });

})
