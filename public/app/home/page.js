define([
    "scyllaApp"
], function(
    scyllaApp
    ){
    'use strict';

    return scyllaApp.factory('Page', function(){
        var firstLevelNavId = "";
        return {
            firstLevelNavId:function(){return firstLevelNavId;},
            setFirstLevelNavId:function(id){firstLevelNavId = id;}
        }
    })
})