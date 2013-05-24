define([
    "scyllaApp",
    "home/page"
], function(
    scyllaApp,
    Page
    ){
    return scyllaApp.controller("PageController", function($scope, $http, Page) {
        $scope.Page = Page;
        $scope.pages = [
            {label:"Home", href:"#", id:"homeNav", active:false},
            {label:"Reports", href:"#/reports", id:"reportsNav", active:false},
            {label:"Batches", href:"#/batches", id:"batchesNav", active:false}
        ];
        $scope.isActive = function(item){
            //console.log(item.id, Page.firstLevelNavId());
            return item.id === Page.firstLevelNavId() ? "active" : "";
        }

    });

})
