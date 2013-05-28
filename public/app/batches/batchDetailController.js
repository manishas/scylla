define([
    "scyllaApp",
    "toastr",
    "moment",
    "dpd"
], function(
    scyllaApp,
    toastr,
    moment,
    dpd
    ){

    return scyllaApp.controller("BatchDetailController", function($scope, $route, $routeParams, $http, Page) {
        Page.setFirstLevelNavId("batchesNav");
        $scope.batch = {};
        $scope.selectedReportsToAdd = [];
        $scope.availableReports = [];

        //TODO: Tear this down when controller destroyed.
        dpd.batchresults.on("create", function(batchResult){
            console.log("DPD Event", batchResult);
            if(batchResult.batchId == $scope.batch.id){
                $scope.getBatch($scope.batch.id);
            }
        });


        var filterOutAlreadyIncludedReports = function(report){
            return !$scope.batch.reports.some(function(includedReport){
                return (includedReport.id == report.id);
            });
        };

        $scope.loadAvailableReports = function(){
            $http.get("/reports")
                .success(function(reports){
                    $scope.availableReports = reports.filter(filterOutAlreadyIncludedReports);
                })
                .error(function(err){
                    alert(err);
                });
        }

        $scope.addReports = function(reportsToAdd){
            $scope.batch.reportIds = $scope.batch.reportIds.concat(reportsToAdd);
            $scope.saveBatch($scope.batch)
                .success(function(){
                    $("#addReport").modal('hide');
                });
        };
        $scope.removeReport = function(reportIdToRemove){
            var reportIndex = $scope.batch.reportIds.indexOf(reportIdToRemove);
            if(reportIndex > -1){
                $scope.batch.reportIds.splice(reportIndex, 1);
                $scope.saveBatch($scope.batch);
            }
        }
        $scope.editBatch = function(batch){
            $scope.saveBatch(batch)
                .success(function(batch){
                    $("#editBatch").modal('hide');
                })
        }
        $scope.saveBatch = function(batch){
            return $http.put("/batches/" + batch.id, batch)
                .success(function(batch){
                    $scope.getBatch(batch.id);
                    toastr.success("Batch Saved: " + batch.name);
                })
                .error(function(err){
                    alert(err);
                })
        }


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
            $http.get("/batches/" + id, {params:{includeResults:"true", includeReports:"true"}})
                .success(function(batch){
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
