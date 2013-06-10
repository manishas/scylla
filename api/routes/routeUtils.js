module.exports = (function(){
    var Q = require('q');

    var normalSuccess = function(res){
        return function(value){
            if(value)
                res.send(value);
            else
                res.send(404);
        }
    };
    var normalFail = function(res){
        return function(error){
            console.log("Error: ", error);
            res.send(500, error);
        }
    }
    var validateInputs = function(body, rules){
        var deferred = Q.defer();
        if(typeof body === "undefined" || body == null){
            deferred.reject({errors:{"body":"No Data Submitted"}});
        } else {
            var hasError = false;
            var errors = {};
            for(var property in rules){
                var rule = rules[property];
                var result = rule(body[property]);
                if(result !== true){
                    hasError = true;
                    errors[property] = result;
                }
            }
            if(hasError){
                deferred.reject(errors);
            } else {
                deferred.resolve(body);
            }
        }

        return deferred.promise;
    };

    var simpleValidators = {
        required:function(value){
            if(typeof value === "undefined" || value == null || value == ""){
                return "is required."
            }
            return true;
        }
    };


    return {
        success:normalSuccess,
        fail:normalFail,
        validateInputs:validateInputs,
        v:simpleValidators
    }
})();
