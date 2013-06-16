define([
    "scyllaApp",
    "toastr",
    "moment",
    "directives/diff/diff",
    "directives/diff/diffAdapter"
], function(
    scyllaApp,
    toastr,
    moment,
    diffDirective,
    diffAdapter
    ){

    return scyllaApp.controller("ResultDiffDetailController", function($scope, $route, $routeParams, $http, Page) {
        Page.setFirstLevelNavId("reportsNav");
        Page.liviconItUp();
        $scope.$watch('resultDiff', Page.liviconItUp );
        $scope.resultDiff = {};
        $scope.diff = {};

        $scope.getResultDiff = function(resultDiffId){

            $http.get("/result-diffs/" + resultDiffId, {params:{includeResults:true, includeReport:true}})
                .success(function(resultDiff){
                    $scope.resultDiff = resultDiff;
                    $scope.diff = diffAdapter.reportResultToDiff(resultDiff);
                })
                .error(function(err){
                    alert(err)
                });
        };

        $scope.getResultDiff($routeParams.id);


    });
});
