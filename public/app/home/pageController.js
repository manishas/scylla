define([
    "scyllaApp",
    "home/page",
    "utilities/debounce"
], function(
    scyllaApp,
    Page,
    dbnc
    ){
    return scyllaApp.controller("PageController", function($scope, $http, Page, debounce) {
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


        var run_livicon = function(){
            console.log("Icons Added");
            var $domPath = $("#mainView");
            $domPath.find(".livicon").addLivicon();
        };

        /**
         * Debounced call to add the icons.  Call it as much as you like, ANY time something might have changed, it won't have an adverse impact
         * @type {*}
         */
        Page.liviconItUp = debounce(run_livicon, 20, false);


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
