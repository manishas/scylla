module.exports = (function(){
    'use strict';
    var restify = require('restify');
    var Q = require('q');
    var util = require('util');

    var normalSuccess = function(res, next){
        return function(value){
            if(value){
                res.send(value);
                next();
            } else {
                next(new restify.ResourceNotFound("Not Found"));
            }
        };
    };

    var imageSuccess = function(res, imagePlucker, next){
        return function(value){
            var image = imagePlucker(value);
            if(image){
                //res.contentType("image/png");
                res.setHeader('Content-Type', 'image/png');
                var imageContents = image.replace(/^data:image\/png;base64,/, "");
                var imageBuffer = new Buffer(imageContents, 'base64');
                //res.write(imageBuffer);
                res.end(imageBuffer, 'binary');
                next();
            } else {
                next(new restify.ResourceNotFound("Not Found"));
            }
        }
    };

    var normalFail = function(res, next){
        return function(error){
            console.error("\nRoute Failure: ", util.inspect(error));
            console.log(error.stack);
            next(new restify.InternalError(util.inspect(error)));
        };
    };

    var validateInputs = function(body, rules){
        var deferred = Q.defer();
        if(typeof body === "undefined" || body === null){
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
            if(typeof value === "undefined" || value === null || value === ""){
                return "is required.";
            }
            return true;
        }
    };


    return {
        success:normalSuccess,
        successImage:imageSuccess,
        fail:normalFail,
        validateInputs:validateInputs,
        v:simpleValidators
    };
})();
