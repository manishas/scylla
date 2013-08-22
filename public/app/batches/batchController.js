define([
    "scyllaApp",
    "moment",
    "toastr",
    "directives/spin/processingSpinner"
], function(
    scyllaApp,
    moment,
    toastr,
    processingSpinner
    ){
    return scyllaApp.controller("BatchController", function($scope, $http, Page) {
        Page.setFirstLevelNavId("batchesNav");
        $scope.batches = [];
        $scope.reportToDelete = {};
        $scope.showDeleteBatch = false;

        $scope.showNewBatch = false;
        $scope.availableReports = [];
        $scope.newBatchName = "";
        $scope.newBatchReportIds = [];
        $scope.batchScheduleEnabled = false;
        $scope.batchScheduleTime = "06:00";
        var dayList =["sun", "mon", "tues", "wed","thurs","fri","sat"];
        $scope.days = {
            sun: false,
            mon: true,
            tues: true,
            wed: true,
            thurs: true,
            fri:true,
            sat:false
        };

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
            var batch = {name:batchName, reports:reportIds};
            batch.scheduleEnabled = $scope.batchScheduleEnabled;
            batch.schedule = {days:[]}
            for(var i=0; i < dayList.length; i++){
                if($scope.days[dayList[i]]) batch.schedule.days.push(i);
            }
            var time = $scope.batchScheduleTime.split(":");
            batch.schedule.hour = time[0];
            batch.schedule.minute = time[1];
            $scope.saveBatch(batch)
                .success(function(batch){
                    $scope.showNewBatch = false;
                })
        };
        $scope.askToConfirmDelete = function(batch){
            $scope.showDeleteBatch = true;
            $scope.batchToDelete = batch;
            console.log("Batch to Delete", batch);
        };

        $scope.deleteBatch = function(batch){
            $scope.isProcessing = true
            console.log("Deleting Batch", batch);
            $http.delete("/batches/" + batch._id)
                .success(function(deleteResult){
                    toastr.success("Batch " + batch.name + " deleted");
                    $scope.getAllBatches();
                    $scope.showDeleteBatch = false;
                    $scope.isProcessing = false;
                });
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
