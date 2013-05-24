define([
    "scyllaApp",
    "moment"
], function(
    scyllaApp,
    moment
    ){
    return scyllaApp.controller("BatchController", function($scope, $http, Page) {
        Page.setFirstLevelNavId("batchesNav");
        $scope.batches = [];

        $http.get("/batches", {params:{include:"results"}})
            .success(function(batches){
                         $scope.batches = batches
                     })
            .error(function(err){
                       alert(err)
                   });

        $scope.dateFormat = function(isoString) {
            return moment(isoString).format("MMMM Do, h:mm A");
        };
    });

})
