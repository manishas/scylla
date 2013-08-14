module.exports = function(app, models, controllers){
    var utils = require('./routeUtils');



    app.get('/reports', function(req, res) {
        controllers.reports.find()
            .then(utils.success(res), utils.fail(res))

    });


    app.get('/reports/:reportId', function(req, res) {
        controllers.reports
            .findById(req.params.reportId,
                      req.query.includeFullImage,
                      req.query.includeResults)
            .then(utils.success(res), utils.fail(res))
    });

    app.put('/reports/:reportId', function(req, res) {
        controllers.reports
            .update(req.params.reportId, req.body)
            .then(utils.success(res), utils.fail(res));
    });

    app.del('/reports/:reportId', function(req, res) {
        controllers.reports
            .remove(req.params.reportId)
            .then(function(deleteResults){
                if(deleteResults.records == 0) throw new Error("No Record Deleted");
                return {
                    _id:req.params.reportId
                }
            })
            .then(utils.success(res), utils.fail(res));
    });

    app.post('/reports', function(req, res) {
        //console.log("Saving Report", req.body);
        controllers.reports
            .createNew(req.body)
            .then(utils.success(res), utils.fail(res));
    });

    app.put('/reports/:reportId/masterResult', function (req, res) {
        controllers.reports
            .updateReportMaster(req.params.reportId, req.body._id)
            .then(utils.success(res), utils.fail(res));
    });


}
