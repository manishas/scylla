module.exports = function(app, models){
    var ObjectId = require('mongoose').Types.ObjectId;
    var commonController = require('./commonController')(ObjectId);
    var handleQueryResult = commonController.handleQueryResult;
    var toObjectIdArray = commonController.toObjectIdArray;


    app.get('/reports', function(req, res) {
        models.Report.find()
            .populate("masterResult")
            .exec(handleQueryResult(res));
    });


    app.get('/reports/:reportId', function(req, res) {
        var q = models.Report.findOne({_id:new ObjectId(req.params.reportId)});
        if(req.query.includeResults) q = q.populate("results");
        q.populate("masterResult")
            .exec(handleQueryResult(res));
    });

    app.put('/reports/:reportId', function(req, res) {
        var id = new ObjectId(req.params.reportId);
        var report = req.body;
        delete report._id;
        models.Report.findOneAndUpdate({_id:id}, report,
            handleQueryResult(res));
    });

    app.del('/reports/:reportId', function(req, res) {
        models.Report.findOne({_id:new ObjectId(req.params.reportId)})
            .remove(function(err, result){
                console.log("Deleting:", result);
                res.send({_id:req.params.reportId});
            });
    });

    app.post('/reports', function(req, res) {
        console.log("Saving Report", req.body);
        var report = new models.Report(req.body);
        report.save(handleQueryResult(res));
    });


    app.put('/reports/:reportId/masterResult', function (req, res) {
        console.log("Saving Master Result on Report:", req.body);

        models.Report.findOne({_id: new ObjectId(req.params.reportId)},
            function (err, report) {
                report.masterResult = new ObjectId(req.body._id);
                report.save(function (err) {
                    res.send({success:!err});
                })
            })


    });


}
