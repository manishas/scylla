module.exports = function(){
    'use strict';

    var execDeferredBridge = function(deferred){
        return function(result){
            if(err){
                console.log("Failing");
                deferred.reject(err);
            } else {
                console.log("Success: " + require('util').inspect(result));
                deferred.resolve(result);
            }
        };
    };

    var execDeferredDeleteBridge = function(deferred){
        return function(err, result){
            if(err){
                deferred.reject(err);
            } else {
                deferred.resolve({records:result});
            }
        };
    };


    var first = function first(results){
        if(results.length === 0){
            console.error("No Results found on", results);
            throw new Error("No Results");
        }

        return results[0];
    };

    return {
        execDeferredBridge:execDeferredBridge,
        execDeferredDeleteBridge:execDeferredDeleteBridge,
        first:first
    };
};