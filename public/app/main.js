//RequireJS Config
require.config({
    paths:{
        jquery:"stubs/jquery",
        angular:"stubs/angular",
        toastr:"../components/toastr/toastr",
        moment:"../components/moment/moment",
        dpd:"/dpd"
    },
    shim:{
        dpd:{
            exports:'dpd'
        }
    }
});

//Start App
require([
    'angular',
    'scyllaApp',
    'diffs/diffDetailController',
    'home/pageController',
    'home/homeController',
    'reports/reportController',
    'reports/reportDetailController',
    'batches/batchController'
], function (
    angular,
    scyllaApp,
    DiffDetailController,
    PageController,
    HomeController,
    ReportController,
    ReportDetailController,
    BatchController
    ) {



    scyllaApp.config(['$routeProvider',function($routeProvider){
        console.log("Configuring Routes");
        $routeProvider
            .when('/home',
                  {templateUrl:'app/home/home.html',
                      controller:"HomeController"})
            .when('/reports',
                  {templateUrl:'app/reports/reports.html',
                      controller:"ReportController"})
            .when('/reports/:id',
                  {templateUrl:'app/reports/reportDetail.html',
                      controller:"ReportDetailController"})
            .when('/diffs/:id',
                  {templateUrl:'app/views/diffs/diffDetail.html',
                      controller:"DiffDetailController"})
            .when('/batches',
                  {templateUrl:'app/batches/batches.html',
                      controller:"BatchController"})
            .otherwise({redirectTo:"/home"})
    }]);


    angular.bootstrap(document, ['scyllaApp']);
});
