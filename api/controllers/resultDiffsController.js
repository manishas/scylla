module.exports = function(app, models){
    var ObjectId = require('mongoose').Types.ObjectId;
    var handleQueryResult = require('./commonController')(ObjectId).handleQueryResult;


    app.get('/result-diffs', function(req, res) {
        models.ResultDiff.find()
            .exec(handleQueryResult(res))
    });

    app.get('/report-results/:resultId/diffs', function(req, res) {
        var resultId = new ObjectId(req.params.resultId);
        models.ResultDiff.find(
            {$or:[
                {reportResultA:resultId},
                {reportResultB:resultId}
            ]})
            .exec(handleQueryResult(res))
    });

    app.get('/result-diffs/:diffId', function(req, res) {
        var query = models.ResultDiff.findOne({_id:new ObjectId(req.params.diffId)});
        if(req.query.includeResults){
            query = query.populate("reportResultA reportResultB");
        }
        if(req.query.includeReport){
            console.log("Including Report")
            query = query.populate("report");
        }
        query.exec(handleQueryResult(res))
    });

    app.put('/result-diffs/:diffId', function(req, res) {
        var id = new ObjectId(req.params.diffId);
        var diff = req.body;
        delete diff._id;
        models.ResultDiff.findOneAndUpdate({_id:id}, diff,
            handleQueryResult(res))
    });

    app.del('/result-diffs/:diffId', function(req, res) {
        models.ResultDiff.findOne({_id:new ObjectId(req.params.batchId)})
            .remove(function(err, result){
                console.log("Deleting:", result);
                handleQueryResult(res)(err, {_id:req.params.batchId});
            });
    });

    app.post('/result-diffs', function(req, res) {
        console.log("Saving Result Diff", req.body);
        var resultDiffSrc = req.body;
            resultDiffSrc.report = new ObjectId(resultDiffSrc.report._id);
        if(resultDiffSrc.reportResultA)
            resultDiffSrc.reportResultA = new ObjectId(resultDiffSrc.reportResultA._id);
        if(resultDiffSrc.reportResultB)
            resultDiffSrc.reportResultB = new ObjectId(resultDiffSrc.reportResultB._id);
        var resultDiff = new models.ResultDiff(resultDiffSrc);
        resultDiff.save(handleQueryResult(res));
    });

}
