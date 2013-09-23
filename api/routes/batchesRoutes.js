module.exports = function(server, models, controllers){
    'use strict';
    var utils = require('./routeUtils');

    server.get('/batches', function(req, res, next) {
        controllers.batches.find(req.query.includeResults)
            .then(utils.success(res, next), utils.fail(res, next));
    });

    server.get('/batches/:batchId', function(req, res, next) {
        controllers.batches
            .findById(req.params.batchId,
                      req.query.includeReports,
                      req.query.includeResults)
            .then(utils.success(res, next), utils.fail(res, next));
    });

    server.put('/batches/:batchId', function(req, res, next) {
        controllers.batches
            .update(req.params.batchId, req.body)
            .then(utils.success(res, next), utils.fail(res, next));
    });

    server.del('/batches/:batchId', function(req, res, next) {
        controllers.batches
            .remove(req.params.batchId)
            .then(function(deleteResults){
                if(deleteResults.records === 0){ throw new Error("No Record Deleted"); }
                return {
                    _id:req.params.batchId
                };
            })
            .then(utils.success(res, next), utils.fail(res, next));
    });

    server.del('/batches/:batchId/reports/:reportId', function(req, res, next) {
        controllers.batches
            .removeReportFromBatch(req.params.batchId, req.params.reportId)
            .then(utils.success(res, next), utils.fail(res, next));
    });

    server.post('/batches', function(req, res, next) {
        controllers.batches
            .createNew(req.body)
            .then(utils.success(res, next), utils.fail(res, next));
    });

    server.post('/batches/:batchId/reports', function (req, res, next) {
        controllers.batches
            .addReportToBatch(req.body, req.params.batchId)
            .then(utils.success(res, next), utils.fail(res, next));

    });

};
