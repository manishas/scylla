module.exports = function(server, models, controllers){
    'use strict';
    var utils = require('./routeUtils');

    server.get('/batch-results', function(req, res, next) {
        controllers.batchResults.find()
            .then(utils.success(res, next), utils.fail(res, next));
    });

    server.get('/batch-results/:resultId', function(req, res, next) {
        controllers.batchResults.findById(req.params.resultId)
            .then(utils.success(res, next), utils.fail(res, next));
    });

    server.put('/batch-results/:resultId', function(req, res, next) {
        controllers.batchResults
            .update(req.params.resultId, req.body)
            .then(utils.success(res, next), utils.fail(res, next));
    });

    server.del('/batch-results/:resultId', function(req, res, next) {
        controllers.batchResults
            .remove(req.params.resultId)
            .then(function(deleteResults){
                if(deleteResults.records === 0){ throw new Error("No Record Deleted"); }
                return {
                    _id:req.params.resultId
                };
            })
            .then(utils.success(res, next), utils.fail(res, next));
    });

    server.post('/batches/:batchId/results', function(req, res, next) {
        controllers.batchResults
            .createNew(req.body)
            .then(function(result){
                return controllers.batchResults.addResultToBatch(req.params.batchId, result)
                    .then(function(){
                        //console.log("Final Result: " + require('util').inspect(finalResult));
                        return result;
                    });
            })
            .then(utils.success(res, next), utils.fail(res, next));

    });

};
