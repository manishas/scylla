//RequireJS Config
require.config({
    paths:{
        jquery:"stubs/jquery",
        aBootstrap:"../components/angular-bootstrap/ui-bootstrap-tpls",
        angular:"stubs/angular",
        toastr:"../components/toastr/toastr",
        moment:"../components/moment/moment"
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
    'compares/comparesController',
    'batches/batchController',
    'batches/batchDetailController',
    'batches/batchResultController'
], function (
    angular,
    scyllaApp,
    DiffDetailController,
    PageController,
    HomeController,
    ReportController,
    ReportDetailController,
    ComparesController,
    BatchController,
    BatchDetailController,
    BatchResultController
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
            .when('/compare',
                  {templateUrl:'app/compares/compares.html',
                      controller:"ComparesController"})
            .when('/compare/:id',
                  {templateUrl:'app/compares/compareDetail.html',
                      controller:"CompareDetailController"})
            .when('/diffs/:id',
                  {templateUrl:'app/diffs/diffDetail.html',
                      controller:"DiffDetailController"})
            .when('/batches',
                  {templateUrl:'app/batches/batches.html',
                      controller:"BatchController"})
            .when('/batches/:batchId/results/:resultId',
                  {templateUrl:'app/batches/batchResult.html',
                      controller:"BatchResultController",
                      reloadOnSearch:false})
            .when('/batches/:id',
                  {templateUrl:'app/batches/batchDetail.html',
                      controller:"BatchDetailController"})
            .otherwise({redirectTo:"/home"})
    }]);


    angular.bootstrap(document, ['scyllaApp']);
});
