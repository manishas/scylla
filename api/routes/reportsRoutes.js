module.exports = function(server, models, controllers){
    'use strict';
    var utils = require('./routeUtils');



    server.get('/reports', function(req, res, next) {
        console.log("Reports");
        controllers.reports.find()
            .then(utils.success(res, next), utils.fail(res, next));

    });


    server.get('/reports/:reportId', function(req, res, next) {
        controllers.reports
            .findById(req.params.reportId,
                      req.query.includeFullImage,
                      req.query.includeResults)
            .then(utils.success(res, next), utils.fail(res, next));
    });

    server.put('/reports/:reportId', function(req, res, next) {
        controllers.reports
            .update(req.params.reportId, req.body)
            .then(utils.success(res), utils.fail(res));
    });

    server.del('/reports/:reportId', function(req, res, next) {
        controllers.reports
            .remove(req.params.reportId)
            .then(function(deleteResults){
                if(deleteResults.records === 0){ throw new Error("No Record Deleted"); }
                return {
                    _id:req.params.reportId
                };
            })
            .then(utils.success(res, next), utils.fail(res, next));
    });

    server.post('/reports', function(req, res, next) {
        //console.log("Saving Report", req.body);
        controllers.reports
            .createNew(req.body)
            .then(utils.success(res, next), utils.fail(res, next));
    });

    server.put('/reports/:reportId/masterResult', function (req, res, next) {
        controllers.reports
            .updateReportMaster(req.params.reportId, req.body._id)
            .then(utils.success(res, next), utils.fail(res, next));
    });

};
