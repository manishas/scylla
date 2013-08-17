define([
    "scyllaApp",
    "home/page"
], function(
    scyllaApp,
    Page
    ){
    return scyllaApp.controller("HomeController", function($scope, $http, Page) {
        Page.setFirstLevelNavId("homeNav");

    });

})
