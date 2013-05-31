module.exports = function(){
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
    }

    return {
        handleQueryResult:handleQueryResult
    };
}