module.exports = function(ObjectId){
    'use strict';

    var execDeferredBridge = function(deferred){
        return function(err, result){
            if(err){
                console.log("Failing");
                deferred.reject(err);
            } else {
                //console.log(require('util').inspect(result));
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

    var toObjectIdArray = function toObjectIdArray(values){
        return values.map(function(val){ return new ObjectId(val._id || val);});
    };

    var first = function first(results){
        if(results.length === 0){
            console.error("No Results found on", results);
            throw new Error("No Results");
        }

        return results[0];
    };

    return {
        toObjectIdArray:toObjectIdArray,
        execDeferredBridge:execDeferredBridge,
        execDeferredDeleteBridge:execDeferredDeleteBridge,
        first:first
    };
};