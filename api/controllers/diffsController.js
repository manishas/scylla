module.exports = function(app, models){
    var ObjectId = require('mongoose').Types.ObjectId;
    var handleQueryResult = require('./commonController')(ObjectId).handleQueryResult;


    app.get('/diffs', function(req, res) {
        models.Diff.find()
            .exec(handleQueryResult(res))
    });

    app.get('/report-results/:resultId/diffs', function(req, res) {
        var resultId = new ObjectId(req.params.resultId);
        models.Diff.find(
            {$or:[
                {reportResultA:resultId},
                {reportResultB:resultId}
            ]})
            .exec(handleQueryResult(res))
    });

    app.get('/diffs/:diffId', function(req, res) {
        var query = models.Diff.findOne({_id:new ObjectId(req.params.diffId)});
        if(req.query.includeResults){
            query = query.populate("reportResultA reportResultB");
        }
        if(req.query.includeReport){
            console.log("Including Report")
            query = query.populate("report");
        }
        query.exec(handleQueryResult(res))
    });

    app.put('/diffs/:diffId', function(req, res) {
        var id = new ObjectId(req.params.diffId);
        var diff = req.body;
        delete diff._id;
        models.Diff.findOneAndUpdate({_id:id}, diff,
            handleQueryResult(res))
    });

    app.del('/diffs/:diffId', function(req, res) {
        models.Diff.findOne({_id:new ObjectId(req.params.batchId)})
            .remove(function(err, result){
                console.log("Deleting:", result);
                handleQueryResult(res)(err, {_id:req.params.batchId});
            });
    });

    app.post('/diffs', function(req, res) {
        console.log("Saving Diff", req.body);
        var diffSrc = req.body;
            diffSrc.report = new ObjectId(diffSrc.report._id);
            diffSrc.reportResultA = new ObjectId(diffSrc.reportResultA._id);
            diffSrc.reportResultB = new ObjectId(diffSrc.reportResultB._id);
        var diff = new models.Diff(diffSrc);
        diff.save(handleQueryResult(res));
    });

}
