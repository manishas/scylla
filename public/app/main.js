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
    'controllers/diffDetailController',
    'controllers/pageController',
    'controllers/homeController',
    'controllers/reportController',
    'controllers/reportDetailController',
    'controllers/batchController'
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
                  {templateUrl:'app/views/home.html',
                      controller:"HomeController"})
            .when('/reports',
                  {templateUrl:'app/views/reports.html',
                      controller:"ReportController"})
            .when('/reports/:id',
                  {templateUrl:'app/views/reports/reportDetail.html',
                      controller:"ReportDetailController"})
            .when('/diffs/:id',
                  {templateUrl:'app/views/diffs/diffDetail.html',
                      controller:"DiffDetailController"})
            .when('/batches',
                  {templateUrl:'app/views/batches.html',
                      controller:"BatchController"})
            .otherwise({redirectTo:"/home"})
    }]);


    angular.bootstrap(document, ['scyllaApp']);
});
