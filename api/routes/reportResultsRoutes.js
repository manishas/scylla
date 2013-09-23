module.exports = function(server, models, controllers){
    'use strict';
    var utils = require('./routeUtils');


    server.get('/report-results', function(req, res, next) {
        controllers.reportResults.find()
            .then(utils.success(res, next), utils.fail(res, next));
    });

    server.get('/report-results/:resultId', function(req, res, next) {
        controllers.reportResults.findById(req.params.resultId)
            .then(utils.success(res, next), utils.fail(res, next));

    });

    server.put('/report-results/:resultId', function(req, res, next) {
        controllers.reportResults
            .update(req.params.resultId, req.body)
            .then(utils.success(res, next), utils.fail(res, next));
    });

    server.del('/report-results/:resultId', function(req, res, next) {
        controllers.reportResults
            .remove(req.params.resultId)
            .then(function(deleteResults){
                if(deleteResults.records === 0){ throw new Error("No Result Deleted"); }
                return {
                    _id:req.params.resultId
                };
            })
            .then(utils.success(res, next), utils.fail(res, next));
        //TODO: Move to promises once diffsController is created
        var resultId = req.params.resultId;
        controllers.resultDiffs.find(
            {$or:[
                {reportResultA:resultId},
                {reportResultB:resultId}
            ]})
            .remove(function(/*err, result*/){
                //console.log("Deleted Diffs: ", result);
            });
    });

    server.post('/reports/:reportId/results', function(req, res, next) {
        controllers.reportResults
            .createNew(req.body)
            .then(function(result){
                console.log("Saving Result ", result._id, " on ", req.params.reportId);
                return controllers.reports
                    .addResultToReport(req.params.reportId, result)
                    .then(function(){
                        return result;
                    });
            })
            .then(utils.success(res, next), utils.fail(res, next));

    });
};
