define([
    "scyllaApp",
    "toastr",
    "moment"
], function(
    scyllaApp,
    toastr,
    moment
    ){

    return scyllaApp.controller("ReportDetailController", function($scope, $route, $routeParams, $http, Page) {
        Page.setFirstLevelNavId("reportsNav");

        $scope.report = {};
        $scope.showEditModal = false;

        var resultSort = function(a,b){
            return a.timestamp < b.timestamp;
        }

        $scope.getReport = function(id){

            $http.get("/reports/" + id, {params:{includeResults:true}})
                .success(function(report){
                             $scope.loaded = true;
                             if(report.results){
                                 report.results.sort(resultSort);
                                 for(var i in report.results){
                                     $scope.loadResultDiffs(report.results[i]);
                                 }
                             }

                             $scope.report = report
                         })
                .error(function(err){
                           alert(err)
                       });
        }
        $scope.getReport($routeParams.id);

        $scope.loadResultDiffs = function(result){
            $http.get("/report-results/" + result._id + "/diffs")
                .success(function(resultDiffs){
                    result.resultDiffs = resultDiffs;
                            })
                .error(function(err){
                    alert(err)
                });
        }

        $scope.dateFormat = function(isoString) {
            return moment(isoString).format("MMMM Do, h:mm A");
        };
        $scope.getResultClass = function(result) {
            if($scope.report.masterResult && result._id == $scope.report.masterResult._id) {
                return "masterResult"
            }
            return "notMasterResult";
        };
        $scope.getResultDiffClass = function(resultDiff){
            var classes = [];
            if($scope.report.masterResult &&
            //Initially we have just the IDs, but later we'll have the entire object...
            // so our comparison has to take both into account.
               (resultDiff.reportResultA._id || resultDiff.reportResultA) == $scope.report.masterResult._id) {
                classes.push( "resultAIsMaster");
            } else if($scope.report.masterResult &&
               (resultDiff.reportResultB._id || resultDiff.reportResultB) == $scope.report.masterResult._id) {
                classes.push( "resultBIsMaster");
            }
            classes.push (resultDiff.distortion > 0 ? "fail" : "pass");

            return classes.join(" ");
        }

        $scope.formatResultHeader = function(result){
            var label = $scope.dateFormat(result.timestamp);

            return label;
        };

        $scope.setNewMaster = function setNewMaster(result){
            $scope.report.masterResult = result;
            $http.put("/reports/" + $scope.report._id + "/masterResult", result)
                .success(function(){
                    toastr.success("Master Result Set");
                })
                .error(function(error){
                    console.error("Error Saving Master: ", error);
                    alert(error);
                })
            //$scope.saveReport($scope.report);
        };

        $scope.editReport = function(report) {
            $scope.saveReport(report)
                .success(function(){
                    $scope.showEditModal = false;
                });
        }

        $scope.saveReport = function(report){
            console.log("Save Report: ", report);
            return $http.put("/reports/" + report._id, report)
                .success(function(report){
                    toastr.success("Report Saved: " + report.name);
                 })
                .error(function(error){
                    console.error("Error Saving Report: ", error);
                    $("#saveReport .alert").show();
                    //TODO: Show Specific Failure Message

                })
        }
    });
});
