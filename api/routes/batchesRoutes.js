module.exports = function(app, models, controllers){
    'use strict';
    var utils = require('./routeUtils');


    app.get('/batches', function(req, res) {
        controllers.batches.find(req.query.includeResults)
            .then(utils.success(res), utils.fail(res));
    });

    app.get('/batches/:batchId', function(req, res) {
        controllers.batches
            .findById(req.params.batchId,
                      req.query.includeReports,
                      req.query.includeResults)
            .then(utils.success(res), utils.fail(res));
    });

    app.put('/batches/:batchId', function(req, res) {
        controllers.batches
            .update(req.params.batchId, req.body)
            .then(utils.success(res), utils.fail(res));
    });

    app.del('/batches/:batchId', function(req, res) {
        controllers.batches
            .remove(req.params.batchId)
            .then(function(deleteResults){
                if(deleteResults.records === 0){ throw new Error("No Record Deleted"); }
                return {
                    _id:req.params.batchId
                };
            })
            .then(utils.success(res), utils.fail(res));
    });

    app.del('/batches/:batchId/reports/:reportId', function(req, res) {
        controllers.batches
            .removeReportFromBatch(req.params.batchId, req.params.reportId)
            .then(utils.success(res), utils.fail(res));
    });

    app.post('/batches', function(req, res) {
        controllers.batches
            .createNew(req.body)
            .then(utils.success(res), utils.fail(res));
    });

    app.post('/batches/:batchId/reports', function (req, res) {
        controllers.batches
            .addReportToBatch(req.body, req.params.batchId)
            .then(utils.success(res), utils.fail(res));

    });

};
