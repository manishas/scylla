define([
    "scyllaApp"
], function(
    scyllaApp
    ){
    return scyllaApp.factory('Page', function(){
        var firstLevelNavId = "";
        return {
            firstLevelNavId:function(){return firstLevelNavId;},
            setFirstLevelNavId:function(id){firstLevelNavId = id;}
        }
    })
})