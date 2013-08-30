define([
    "scyllaApp",
    "home/page"
], function(
    scyllaApp,
    Page
    ){
    'use strict';

    return scyllaApp.controller("HomeController", function($scope, $http, Page) {
        Page.setFirstLevelNavId("homeNav");

    });

})
