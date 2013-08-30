module.exports = function(app, models, controllers){
    'use strict';
    var utils = require('./routeUtils');

    app.get('/batch-results', function(req, res) {
        controllers.batchResults.find()
            .then(utils.success(res), utils.fail(res));
    });

    app.get('/batch-results/:resultId', function(req, res) {
        controllers.batchResults.findById(req.params.resultId)
            .then(utils.success(res), utils.fail(res));
    });

    app.put('/batch-results/:resultId', function(req, res) {
        controllers.batchResults
            .update(req.params.resultId, req.body)
            .then(utils.success(res), utils.fail(res));
    });

    app.del('/batch-results/:resultId', function(req, res) {
        controllers.batchResults
            .remove(req.params.resultId)
            .then(function(deleteResults){
                if(deleteResults.records === 0){ throw new Error("No Record Deleted"); }
                return {
                    _id:req.params.resultId
                };
            })
            .then(utils.success(res), utils.fail(res));
    });

    app.post('/batches/:batchId/results', function(req, res) {
        controllers.batchResults
            .createNew(req.body)
            .then(function(result){
                return controllers.batchResults.addResultToBatch(req.params.batchId, result)
                    .then(function(){
                        //console.log("Final Result: " + require('util').inspect(finalResult));
                        return result;
                    });
            })
            .then(utils.success(res), utils.fail(res));

    });

};
