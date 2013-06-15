define([
    "scyllaApp",
    "toastr",
    "moment"
], function(
    scyllaApp,
    toastr,
    moment
    ){

    return scyllaApp.controller("CompareDetailController", function($scope, $route, $routeParams, $http, Page) {
        Page.setFirstLevelNavId("comparesNav");
        Page.liviconItUp();
        $scope.$watch('compare.results', Page.liviconItUp );

        $scope.compare = {};
        $scope.showEditModal = false;

        var resultSort = function(a,b){
            return a.timestamp < b.timestamp;
        }

        $scope.getCompare = function(id){

            $http.get("/abcompares/" + id, {params:{includeResults:true}})
                .success(function(compare){
                             $scope.loaded = true;
                             if(compare.results){
                                 compare.results.sort(resultSort);
                             }

                             $scope.compare = compare
                         })
                .error(function(err){
                           alert(err)
                       });
        }
        $scope.getCompare($routeParams.id);

        $scope.dateFormat = function(isoString) {
            return moment(isoString).format("MMMM Do, h:mm A");
        };

        $scope.runCompare = function(){
            $http.get("/abcompares/" + $scope.compare._id + "/run")
                .success(function(compareRunResult){
                    $scope.compare.results.unshift(compareRunResult.abCompareResult);
                    Page.liviconItUp();
                })
                .error(function(err){
                    alert(err);
                });
        }

        $scope.getDistortionClass = function(result){
            if(result.distortion == -1) {
                return "exception";
            } else if(result.distortion == 0) {
                return "pass";
            } else {
                return "fail";
            }
        }
        $scope.formatResultHeader = function(result){
            var label = $scope.dateFormat(result.timestamp);
            return label;
        };

        $scope.editCompare = function(compare) {
            $scope.saveCompare(compare)
                .success(function(){
                    $scope.showEditModal = false;
                });
        }

        $scope.saveCompare = function(compare){
            console.log("Save Compare: ", compare);
            return $http.put("/abcompares/" + compare._id, compare)
                .success(function(compare){
                    toastr.success("Compare Saved: " + compare.name);
                 })
                .error(function(error){
                    console.error("Error Saving Compare: ", error);
                    $("#saveCompare .alert").show();
                    //TODO: Show Specific Failure Message

                })
        }
    });
});
