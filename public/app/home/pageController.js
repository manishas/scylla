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
        };




        $scope.showLoginModal = false;
        $scope.showLogin = function(){
            $scope.showLoginModal = true;
        }
        $scope.closeLogin = function(){
            $scope.showLoginModal = false;
        }
        $scope.login = function(email, password){
            $http.post("/account/login", {email:email,password:password})
                .success(function(success){
                    console.log("Success", success);
                })
                .error(function(err){
                    alert(err)
                });
        }

        $scope.showRegisterModal = false;
        $scope.showRegister = function(){
            $scope.showRegisterModal = true;
        }
        $scope.closeLogin = function(){
            $scope.showRegisterModal = false;
        }
        $scope.register = function(name, email, password){
            $http.post("/account/register", {name:name, email:email, password:password})
                .success(function(success){
                    console.log("Success", success);
                })
                .error(function(err){
                    alert(err)
                });
        }

    });

})
