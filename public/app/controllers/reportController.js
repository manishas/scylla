define([
    "scyllaApp",
    "toastr"
], function(
    scyllaApp,
    toastr
    ){

    return scyllaApp.controller("ReportController", function($scope, $http, Page) {
        Page.setFirstLevelNavId("reportsNav");
        $scope.batches = [];

        $scope.getThumbnail = function getThumbnail(report){
            if(report && report.masterResult) {
                return report.masterResult.result;
            }
            return "images/reportHasNoMasterResult.png"
        }

        $scope.getAllReports = function(){

            $http.get("/reports")
                .success(function(reports){
                             $scope.loaded = true;
                             $scope.reports = reports
                         })
                .error(function(err){
                           alert(err)
                       });
        }
        $scope.getAllReports();

        $scope.addReport = function(name, url){
            console.log("New Report: ", name, url);
            $http.post("/reports", {name:name,url:url})
                .success(function(report){
                    $("#newReport").modal('hide');
                    toastr.success("New Report Created: " + report.name);
                    $scope.getAllReports();
                 })
                .error(function(error){
                    console.error("Error Saving Report: ", error);
                    $("#newReport .alert").show();
                    //TODO: Show Specific Failure Message

                })
        }
    });
});
