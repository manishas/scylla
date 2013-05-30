define([
    "scyllaApp",
    "toastr"
], function(
    scyllaApp,
    toastr
    ){

    return scyllaApp.controller("ReportController", function($scope, $http, Page) {
        Page.setFirstLevelNavId("reportsNav");
        $scope.reports = [];
        $scope.reportToDelete = {};

        $scope.showDeleteReport = false;
        $scope.showNewReport = false;

        $scope.getThumbnail = function getThumbnail(report){
            if(report && report.masterResult) {
                return report.masterResult.result;
            }
            return "images/reportHasNoMasterResult.png"
        };

        $scope.getAllReports = function(){

            $http.get("/reports")
                .success(function(reports){
                             $scope.loaded = true;
                             $scope.reports = reports
                         })
                .error(function(err){
                           alert(err)
                       });
        };
        $scope.getAllReports();

        $scope.deleteReport = function deleteReport(report){
            $scope.showDeleteReport = true
            $scope.reportToDelete = report;
            console.log("Report to Delete", report);
        };

        $scope.deleteDiff = function deleteDiff(diffId){
            $http.delete("/diffs/" + diffId)
                .error(function(error){
                    console.error("Error Deleting Diff", diffId, error);
                });
        };
        $scope.deleteResult = function deleteResult(resultId){
            $http.delete("/report-results/" + resultId)
                .error(function(error){
                    console.error("Error Deleting Result", resultId, error);
                })
        }

        $scope.confirmDeleteReport = function confirmDeleteReport(report){
            console.log("Deleting Report", report);
            var diffBeingDeleted = {};//Hash Map to ensure we only try to delete diffs once
            $http.get("/reports/" + report._id, {params:{include:"results"}})
                .success(function(report){
                    if(report.results){
                        report.results.forEach(function(result){
                            result.diffs.forEach(function(diff){
                                if(!diffBeingDeleted[diff._id]){
                                    $scope.deleteDiff(diff._id);
                                    diffBeingDeleted[diff._id] = true;
                                }
                            });
                            $scope.deleteResult(result._id);
                        });
                    }
                    $http.delete("/reports/" + report._id)
                        .success(function(deletedReport){
                            console.log("Deleted Report",deletedReport);
                            $scope.getAllReports();
                            $scope.showDeleteReport = false;
                        })
                        .error(function(err){
                            console.error(err);
                        });
                });

        };

        $scope.addReport = function(name, url){
            console.log("New Report: ", name, url);
            $http.post("/reports", {name:name,url:url})
                .success(function(report){
                    $scope.showNewReport = false;
                    toastr.success("New Report Created: " + report.name);
                    $scope.getAllReports();
                 })
                .error(function(error){
                    console.error("Error Saving Report: ", error);
                    $("#newReport .alert").show();
                    //TODO: Show Specific Failure Message

                });
        };
    });
});
