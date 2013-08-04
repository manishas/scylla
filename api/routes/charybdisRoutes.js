module.exports = function(app, models, controllers){
    var utils = require('./routeUtils');

    app.get('/reports/:reportId/newMaster', function(req,res){
        controllers.charybdis.executeOnReport(req.params.reportId)
            .then(function(reportResult){
                console.log("Setting result " + reportResult._id + " as master for report: " + req.params.reportId);
                return controllers.reports.updateReportMaster(req.params.reportId, reportResult._id)
            })
            .then(utils.success(res), utils.fail(res));
    });

    app.get('/batches/:batchId/run', function(req, res) {
        controllers.charybdis.executeOnBatch(req.params.batchId)
            .then(utils.success(res), utils.fail(res));
    });

    app.get('/abcompares/:compareId/run', function(req, res) {
        controllers.charybdis.executeABCompare(req.params.compareId)
            .then(utils.success(res), utils.fail(res));
    });
}