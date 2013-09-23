module.exports = function(server, models, controllers){
    'use strict';
    var utils = require('./routeUtils');


    server.get('/result-diffs', function(req, res, next) {
        controllers.resultDiffs.find()
            .then(utils.success(res, next), utils.fail(res, next));
    });

    server.get('/report-results/:resultId/diffs', function(req, res, next) {
        controllers.resultDiffs.findForResult(req.params.resultId)
            .then(utils.success(res, next), utils.fail(res, next));
    });

    server.get('/result-diffs/:diffId', function(req, res, next) {
        controllers.resultDiffs
            .findById(req.params.diffId,
                req.query.includeReport,
                req.query.includeResults)
            .then(utils.success(res, next), utils.fail(res, next));
    });

    server.put('/result-diffs/:diffId', function(req, res, next) {
        controllers.resultDiffs
            .update(req.params.diffId, req.body)
            .then(utils.success(res, next), utils.fail(res, next));
    });


    server.del('/result-diffs/:diffId', function(req, res, next) {
        controllers.resultDiffs
            .remove(req.params.diffId)
            .then(function(deleteResults){
                if(deleteResults.records === 0){ throw new Error("No Record Deleted"); }
                return {
                    _id:req.params.diffId
                };
            })
            .then(utils.success(res, next), utils.fail(res, next));
    });

    server.post('/result-diffs', function(req, res, next) {
        controllers.resultDiffs
            .createNew(req.body)
            .then(utils.success(res, next), utils.fail(res, next));

    });

};
