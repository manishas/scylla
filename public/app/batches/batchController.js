define([
    "scyllaApp",
    "moment",
    "toastr"
], function(
    scyllaApp,
    moment,
    toastr
    ){
    return scyllaApp.controller("BatchController", function($scope, $http, Page) {
        Page.setFirstLevelNavId("batchesNav");
        $scope.batches = [];

        $scope.showNewBatch = false;
        $scope.availableReports = [];
        $scope.newBatchName = "";
        $scope.newBatchReportIds = [];

        $scope.showNewBatchWindow = function(){
            $scope.showNewBatch = true;
            $http.get("/reports")
                .success(function(reports){
                    $scope.availableReports = reports;
                })
                .error(function(err){
                    alert(err);
                });
        };

        $scope.addBatch = function(batchName, reportIds){
            $scope.saveBatch({name:batchName, reports:reportIds})
                .success(function(batch){
                    $scope.showNewBatch = false;
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
