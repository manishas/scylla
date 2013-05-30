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

    return scyllaApp.controller("BatchResultController", function($scope, $route, $routeParams, $http, Page) {
        Page.setFirstLevelNavId("batchesNav");
        $scope.batch = {};
        $scope.batchResult = {};
        $scope.currentDiff = {};

        /*
        dpd.batchresults.on("create", function(batchResult){
            console.log("DPD Event", batchResult);
            if(batchResult.batchId == $scope.batch.id){
                $scope.getBatch($scope.batch.id);
            }
        });
        */

        $scope.selectDiff = function(diffId){
            $scope.getDiff(diffId);
        }

        $scope.dateFormat = function(isoString) {
            return moment(isoString).format("MMMM Do, h:mm A");
        };


        $scope.getBatch = function(id){
            $http.get("/batches/" + id, {params:{includeResults:"false", includeReports:"false"}})
                .success(function(batch){
                    //batch.results.sort(function(a,b) { return a.end < b.end; } );
                    $scope.batch = batch

                })
                .error(function(err){
                    alert(err)
                });
        };

        $scope.getBatchResult = function(id){
            $http.get("/batch-results/" + id, {params:{includeResults:"false", includeReports:"true"}})
                .success(function(batchResult){
                    $scope.batchResult = batchResult
                    if(!$routeParams.diffId){
                        for(var id in batchResult.reportResultSummaries){
                            $scope.getDiff(batchResult.reportResultSummaries[id].diffId);
                            break;
                        }
                    }

                })
                .error(function(err){
                    alert(err)
                });
        };

        $scope.getDiff = function(id){
            $http.get("/diffs/" + id, {params:{include:"all"}})
                .success(function(diff){
                    $scope.currentDiff = diff;
                })
                .error(function(err){
                    alert(err)
                });
        };

        $scope.getBatch($routeParams.batchId);
        $scope.getBatchResult($routeParams.resultId);
        if($routeParams.diffId){
            $scope.getDiff($routeParams.diffId);
        }
    });
});
