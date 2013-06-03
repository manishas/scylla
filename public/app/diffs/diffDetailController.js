define([
    "scyllaApp",
    "toastr",
    "moment",
    "directives/diff/diff"
], function(
    scyllaApp,
    toastr,
    moment,
    diffDirective
    ){

    return scyllaApp.controller("DiffDetailController", function($scope, $route, $routeParams, $http, Page) {
        Page.setFirstLevelNavId("reportsNav");


        $scope.getDiff = function(diffId){

            $http.get("/diffs/" + diffId, {params:{includeResults:true, includeReport:true}})
                .success(function(diff){
                    $scope.diff = diff
                })
                .error(function(err){
                    alert(err)
                });
        };

        $scope.getDiff($routeParams.id);

        $scope.dateFormat = function(isoString) {
            return moment(isoString).format("MMMM Do, h:mm A");
        };
        $scope.getResultClass = function(result) {
            if($scope.report.masterResult && result.id == $scope.report.masterResult.id) {
                return "masterResult"
            }
            return "notMasterResult";
        };
        $scope.getDiffClass = function(diff){
            var classes = [];
            if($scope.report.masterResult && diff.reportResultA == $scope.report.masterResult.id) {
                classes.push( "resultAIsMaster");
            } else if($scope.report.masterResult && diff.reportResultB == $scope.report.masterResult.id) {
                classes.push( "resultBIsMaster");
            }
            classes.push (diff.distortion > 0 ? "fail" : "pass");

            return classes.join(" ");
        }

        $scope.formatResultHeader = function(result){
            var label = $scope.dateFormat(result.timestamp);

            return label;
        };

        $scope.setNewMaster = function setNewMaster(result){
            $scope.report.masterResult = result.id;
            $scope.saveReport($scope.report);
            $scope.report.masterResult = result;
        };

        $scope.saveReport = function(report){
            console.log("Save Report: ", report);
            $http.put("/reports/" + report.id, report)
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
