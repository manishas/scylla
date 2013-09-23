module.exports = function(server, models, controllers){
    'use strict';
    var utils = require('./routeUtils');

    server.get('/reports/:reportId/newMaster', function(req, res, next){
        controllers.charybdis.captureReportSnapshot(req.params.reportId)
            .then(function(reportResult){
                //console.log(require('util').inspect(reportResult));
                console.log("Setting result " + reportResult._id + " as master for report: " + req.params.reportId);
                return controllers.reports.updateReportMaster(req.params.reportId, reportResult._id);
            })
            .then(utils.success(res, next), utils.fail(res, next));
    });

    server.get('/reports/:reportId/run', function(req, res, next){
        controllers.charybdis.executeOnReport(req.params.reportId)
            .then(utils.success(res, next), utils.fail(res, next));
    });

    server.get('/batches/:batchId/run', function(req, res, next) {
        controllers.charybdis.executeOnBatch(req.params.batchId)
            .then(utils.success(res, next), utils.fail(res, next));
    });

    server.get('/abcompares/:compareId/run', function(req, res, next) {
        controllers.charybdis.executeABCompare(req.params.compareId)
            .then(utils.success(res, next), utils.fail(res, next));
    });
};