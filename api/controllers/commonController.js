module.exports = function(ObjectId){
    /**
     * Creates a error/result callback that will send a result with either an error or success error code.
     * @param res express result object
     * @return callback function
     */
    var handleQueryResult = function(res){
        return function(err, result){
            if(err){
                console.error("Error", err);
                res.send(500);
            } else if(!result){
                res.send(404);
            } else {
                res.send(result);
            }
        }
    };

    var execDeferredBridge = function(deferred){
        return function(err, result){
            if(err){
                deferred.reject(err)
            } else {
                deferred.resolve(result);
            }
        }
    }

    var execDeferredDeleteBridge = function(deferred){
        return function(err, result){
            if(err){
                deferred.reject(err)
            } else {
                deferred.resolve({records:result});
            }
        }
    }

    var toObjectIdArray = function toObjectIdArray(values){
        return values.map(function(val){ return new ObjectId(val._id || val)});
    };
    var first = function first(results){
        if(results.length == 0){
            console.error("No Results found on", results);
            throw new Error("No Results");
        }

        return results[0];
    };

    return {
        handleQueryResult:handleQueryResult,
        toObjectIdArray:toObjectIdArray,
        execDeferredBridge:execDeferredBridge,
        execDeferredDeleteBridge:execDeferredDeleteBridge,
        first:first
    };
}