module.exports = function(app, models){
    var ObjectId = require('mongoose').Types.ObjectId;
    var handleQueryResult = require('./commonController')().handleQueryResult;


    app.get('/report-results', function(req, res) {
        models.ReportResult.find()
            .populate("report")
            .exec(handleQueryResult(res));
    });

    app.get('/report-results/:resultId', function(req, res) {
        models.ReportResult.findOne({_id:new ObjectId(req.params.resultId)})
            .populate("report")
            .exec(handleQueryResult(res));
    });

    app.put('/report-results/:resultId', function(req, res) {
        var id = new ObjectId(req.params.resultId);
        var repResult = req.body;
        delete repResult._id;
        models.ReportResult.findOneAndUpdate({_id:id}, repResult,
            handleQueryResult(res))
    });

    app.del('/report-results/:resultId', function(req, res) {
        models.ReportResult.findOne({_id:new ObjectId(req.params.resultId)})
            .remove(function(err, result){
                console.log("Deleting:", result);
                res.send({_id:req.params.resultId});
            });
    });

    app.post('/reports/:reportId/results', function(req, res) {
        console.log("Saving New Result on Report:", req.body);
        var reportResult = new models.ReportResult(req.body);
        reportResult.save(function(err){

            models.Report.findOne({_id:new ObjectId(req.params.reportId)},
                function(err, report){
                    report.results.push(reportResult);
                    report.save(function(err){
                        res.send(reportResult);
                    })
                })
        })


    });
}
