define([
    "scyllaApp",
    "toastr",
    "moment"
], function(
    scyllaApp,
    toastr,
    moment
    ){

    return scyllaApp.controller("BatchDetailController", function($scope, $route, $routeParams, $http, Page) {
        Page.setFirstLevelNavId("batchesNav");
        $scope.batch = {};

        $scope.showEditBatch = false;
        $scope.batchScheduleEnabled = false;
        $scope.batchScheduleTime = "";
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
        $scope.showAddReport = false;

        $scope.selectedReportsToAdd = [];
        $scope.availableReports = [];

        //TODO: Tear this down when controller destroyed.
        //TODO: Move to Socket.io
        /*
        dpd.batchresults.on("create", function(batchResult){
            console.log("DPD Event", batchResult);
            if(batchResult.batchId == $scope.batch._id){
                $scope.getBatch($scope.batch._id);
            }
        });
        */


        var filterOutAlreadyIncludedReports = function(report){
            return !$scope.batch.reports.some(function(includedReport){
                return (includedReport._id == report._id);
            });
        };

        $scope.showAddReportsModal = function(){
            $scope.showAddReport = true;
            $http.get("/reports")
                .success(function(reports){
                    $scope.availableReports = reports.filter(filterOutAlreadyIncludedReports);
                })
                .error(function(err){
                    alert(err);
                });
        };

        $scope.showEditBatchModal = function(){
            $scope.showEditBatch = true;
            $scope.batchScheduleEnabled = $scope.batch.scheduleEnabled;
            var sch = $scope.batch.schedule;
            for(var i in dayList){
                $scope.days[dayList[i]] = (sch.days.indexOf(parseInt(i)) != -1);
            }
            $scope.batchScheduleTime =
                ((sch.hour<10) ? "0" + sch.hour : sch.hour) +
                     ":" +
                ((sch.minute<10) ? "0" + sch.minute : sch.minute);
            console.log($scope.days);
            console.log($scope.batchScheduleTime);
        }

        $scope.addReports = function(reportsToAdd){
            $scope.batch.reports = $scope.batch.reports.concat(reportsToAdd);
            $http.post("/batches/" + $scope.batch._id + "/reports", reportsToAdd)
                .success(function(batch){
                    $scope.showAddReport = false;
                    $scope.getBatch(batch._id);
                    toastr.success("Batch Saved: " + batch.name);
                })
                .error(function(err){
                    alert(err);
                });
        };

        $scope.removeReport = function(reportToRemove){
            var reportIndex = $scope.batch.reports.indexOf(reportToRemove);
            if(reportIndex > -1){
                $scope.batch.reports.splice(reportIndex, 1);
                $scope.saveBatch($scope.batch);
            }
        };

        $scope.editBatch = function(batch){
            batch.scheduleEnabled = $scope.batchScheduleEnabled
            batch.schedule.days = [];
            for(var i=0; i < dayList.length; i++){
                if($scope.days[dayList[i]]) batch.schedule.days.push(i);
            }
            var time = $scope.batchScheduleTime.split(":");
            batch.schedule.hour = time[0];
            batch.schedule.minute = time[1];
            $scope.saveBatch(batch)
                .success(function(batch){
                    $scope.showEditBatch = false;
                })
        };

        $scope.saveBatch = function(batch){
            return $http.put("/batches/" + batch._id, batch)
                .success(function(batch){
                    $scope.getBatch(batch._id);
                    toastr.success("Batch Saved: " + batch.name);
                })
                .error(function(err){
                    alert(err);
                })
        };


        $scope.dateFormat = function(isoString) {
            return moment(isoString).format("MMMM Do, h:mm A");
        };

        $scope.getThumbnail = function getThumbnail(report){
            if(report && report.masterResult) {
                return report.masterResult.result;
            }
            return "images/reportHasNoMasterResult.png"
        };

        $scope.getResultClass = function(result) {
            if(result.fail > 0 || result.exception > 0) {
                return "masterResult"
            }
            return "notMasterResult";
        };

        $scope.getReportResultClass = function(reportResult) {
            if(reportResult.diff == -1) {
                return "exception";
            } else if(reportResult.diff == 0) {
                return "pass";
            } else {
                return "fail";
            }
        }

        $scope.getBatch = function(id){
            $http.get("/batches/" + id, {params:{includeResults:true, includeReports:true}})
                .success(function(batch){
                    if(batch.results)
                        batch.results.sort(function(a,b) { return a.end < b.end; } );
                    $scope.batch = batch
                })
                .error(function(err){
                    alert(err)
                });
        }
        $scope.getBatch($routeParams.id);
    });
});
