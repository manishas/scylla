module.exports = function(app, models, schedController, executeBatch){
    var ObjectId = require('mongoose').Types.ObjectId;
    var commonController = require('./commonController')(ObjectId);
    var handleQueryResult = commonController.handleQueryResult;
    var toObjectIdArray = commonController.toObjectIdArray;



    app.get('/batches', function(req, res) {
        var query = models.Batch.find();
        if(req.query.includeResults)
            query = query.populate({path:"results", options:{sort:{end:-1}}});

        query.exec(handleQueryResult(res));
    });

    app.get('/batches/:batchId', function(req, res) {
        var query = models.Batch.findOne({_id:new ObjectId(req.params.batchId)});
        console.log("Params", req.params);
        if(req.query.includeReports)
            query = query.populate("reports masterResult");
        if(req.query.includeResults)
            query = query.populate({path:"results", options:{sort:{end:-1}}});

        query.exec(function(err, batch){
            if(err || !req.query.includeReports){
                handleQueryResult(res)(err, batch);
            } else {
                models.Report.populate(batch.reports, "masterResult",
                    function(err, reports){
                        batch.reports = reports;
                        handleQueryResult(res)(err, batch);
                    });
            }
        });
    });

    app.put('/batches/:batchId', function(req, res) {
        var id = new ObjectId(req.params.batchId);
        var batch = req.body;
        delete batch._id;
        delete batch.reports;
        delete batch.results;
        models.Batch.findOneAndUpdate({_id:id}, batch,
            function(err, result){
                if(!err && result) schedController.addBatchToSchedule(result, executeBatch(result._id));
                handleQueryResult(res)(err, result);
            });

    });

    app.del('/batches/:batchId', function(req, res) {
        models.Batch.findOne({_id:new ObjectId(req.params.batchId)})
            .remove(function(err, result){
                console.log("Deleting:", result);
                schedController.removeBatchFromSchedule(req.params.batchId);
                res.send({_id:req.params.batchId});
            });
    });

    app.post('/batches', function(req, res) {
        //console.log("Saving Batch", req.body);
        var batch = new models.Batch(req.body);
        batch.save(function(err, result){
            if(!err && result) schedController.addBatchToSchedule(result, executeBatch(result._id));
            handleQueryResult(res)(err, result);
        });
    });

    app.post('/batches/:batchId/reports', function (req, res) {
        //console.log("Adding Report to Batch:", req.body);
        models.Batch.findOne({_id: new ObjectId(req.params.batchId)},
            function (err, batch) {
                console.log("Reports in Batch", batch.reports);
                batch.reports.addToSet(toObjectIdArray(req.body));
                batch.save(handleQueryResult(res));
            });


    });

}
