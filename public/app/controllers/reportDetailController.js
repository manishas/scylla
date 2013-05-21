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

        $scope.getReport = function(id){

            $http.get("/reports/" + id, {params:{include:"results"}})
                .success(function(report){
                             $scope.loaded = true;
                             $scope.report = report
                         })
                .error(function(err){
                           alert(err)
                       });
        }
        $scope.getReport($routeParams.id);

        $scope.dateFormat = function(isoString) {
            return moment(isoString).format("'MMMM Do YYYY, h:mm:ss a'");
        };
        $scope.getResultHeaderClass = function(result) {
            if($scope.report.masterResult && result.id == $scope.report.masterResult.id) {
                return "masterResultHeader"
            }
            return "";
        };
        $scope.formatResultHeader = function(result){
            var label = $scope.dateFormat(result.timestamp);

            if($scope.report.masterResult && result.id == $scope.report.masterResult.id) {
                label +=  " (master)"
            }
            return label;
        }

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
