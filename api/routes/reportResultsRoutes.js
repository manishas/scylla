module.exports = function(app, models, controllers){
    var utils = require('./routeUtils');


    app.get('/report-results', function(req, res) {
        controllers.reportResults.find()
            .then(utils.success(res), utils.fail(res));
    });

    app.get('/report-results/:resultId', function(req, res) {
        controllers.reportResults.findById(req.params.resultId)
            .then(utils.success(res), utils.fail(res));

    });

    app.put('/report-results/:resultId', function(req, res) {
        controllers.reportResults
            .update(req.params.resultId, req.body)
            .then(utils.success(res), utils.fail(res));
    });

    app.del('/report-results/:resultId', function(req, res) {
        controllers.reportResults
            .remove(req.params.resultId)
            .then(function(deleteResults){
                if(deleteResults.records == 0) throw new Error("No Result Deleted");
                return {
                    _id:req.params.resultId
                }
            })
            .then(utils.success(res), utils.fail(res));
        //TODO: Move to promises once diffsController is created
        var resultId = req.params.resultId;
        controllers.resultDiffs.find(
            {$or:[
                {reportResultA:resultId},
                {reportResultB:resultId}
            ]})
            .remove(function(err, result){
                //console.log("Deleted Diffs: ", result);
            })
    });

    app.post('/reports/:reportId/results', function(req, res) {
        controllers.reportResults
            .createNew(req.body)
            .then(function(result){
                console.log("Saving Result ", result._id, " on ", req.params.reportId);
                return controllers.reports
                    .addResultToReport(req.params.reportId, result)
                    .then(function(){
                        return result;
                    })
            })
            .then(utils.success(res), utils.fail(res));

    });
}
