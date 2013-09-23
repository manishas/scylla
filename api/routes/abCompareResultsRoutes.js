module.exports = function(server, models, controllers){
    'use strict';
    var utils = require('./routeUtils');


    server.get('/abcompare-results', function(req, res, next) {
        controllers.abCompareResults.find()
            .then(utils.success(res, next), utils.fail(res, next));
    });

    server.get('/abcompare-results/:resultId', function(req, res, next) {
        controllers.abCompareResults.findById(req.params.resultId)
            .then(utils.success(res, next), utils.fail(res, next));

    });

    server.put('/abcompare-results/:resultId', function(req, res, next) {
        controllers.abCompareResults
            .update(req.params.resultId, req.body)
            .then(utils.success(res, next), utils.fail(res, next));
    });

    server.del('/abcompare-results/:resultId', function(req, res, next) {
        controllers.abCompareResults
            .remove(req.params.resultId)
            .then(function(deleteResults){
                if(deleteResults.records === 0){ throw new Error("No Result Deleted"); }
                return {
                    _id:req.params.resultId
                };
            })
            .then(utils.success(res, next), utils.fail(res, next));
    });

    server.post('/abcompares/:compareId/results', function(req, res, next) {
        controllers.abCompareResults
            .createNew(req.body)
            .then(function(result){
                //console.log("Saving Result ", result._id, " on ", req.params.compareId);
                return controllers.abCompares
                    .addResultToCompare(req.params.compareId, result)
                    .then(function(){
                        return result;
                    });
            })
            .then(utils.success(res, next), utils.fail(res, next));

    });
};
