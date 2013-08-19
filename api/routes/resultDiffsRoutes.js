module.exports = function(app, models, controllers){
    var utils = require('./routeUtils');


    app.get('/result-diffs', function(req, res) {
        controllers.resultDiffs.find()
            .then(utils.success(res), utils.fail(res))
    });

    app.get('/report-results/:resultId/diffs', function(req, res) {
        controllers.resultDiffs.find(req.params.resultId)
            .then(utils.success(res), utils.fail(res))
    });

    app.get('/result-diffs/:diffId', function(req, res) {
        controllers.resultDiffs
            .findById(req.params.diffId,
                req.query.includeReport,
                req.query.includeResults)
            .then(utils.success(res), utils.fail(res))
    });

    app.put('/result-diffs/:diffId', function(req, res) {
        controllers.resultDiffs
            .update(req.params.diffId, req.body)
            .then(utils.success(res), utils.fail(res));
    });


    app.del('/result-diffs/:diffId', function(req, res) {
        controllers.resultDiffs
            .remove(req.params.diffId)
            .then(function(deleteResults){
                if(deleteResults.records == 0) throw new Error("No Record Deleted");
                return {
                    _id:req.params.diffId
                }
            })
            .then(utils.success(res), utils.fail(res));
    });

    app.post('/result-diffs', function(req, res) {
        controllers.resultDiffs
            .createNew(req.body)
            .then(utils.success(res), utils.fail(res));

    });



};
