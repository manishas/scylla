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

    var toObjectIdArray = function toObjectIdArray(values){
        return values.map(function(val){ return new ObjectId(val._id || val)});
    };

    return {
        handleQueryResult:handleQueryResult,
        toObjectIdArray:toObjectIdArray
    };
}