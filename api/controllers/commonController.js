module.exports = function(ObjectId){
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