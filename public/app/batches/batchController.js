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

        $scope.availableReports = [];
        $scope.newBatchName = "";
        $scope.newBatchReportIds = [];

        $scope.loadAvailableReports = function(){
            $http.get("/reports")
                .success(function(reports){
                    $scope.availableReports = reports;
                })
                .error(function(err){
                    alert(err);
                });
        };

        $scope.addBatch = function(batchName, reportIds){
            $scope.saveBatch({name:batchName, reportIds:reportIds})
                .success(function(batch){
                    $("#addBatch").modal('hide');
                })
        };

        $scope.saveBatch = function(batch){
            return $http.post("/batches/", batch)
                .success(function(batch){
                    $scope.getAllBatches();
                    toastr.success("Batch Saved: " + batch.name);
                })
                .error(function(err){
                    alert(err);
                })
        };

        $scope.getAllBatches = function(){
            $http.get("/batches", {params:{includeResults:"true"}})
                .success(function(batches){
                             $scope.batches = batches
                         })
                .error(function(err){
                           alert(err)
                       });
        };
        $scope.getAllBatches();

        $scope.dateFormat = function(isoString) {
            return moment(isoString).format("MMMM Do, h:mm A");
        };
    });

})
