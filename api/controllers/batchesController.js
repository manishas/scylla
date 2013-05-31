module.exports = function(app, models){
    var ObjectId = require('mongoose').Types.ObjectId;
    var handleQueryResult = require('./commonController')().handleQueryResult;



    app.get('/batches', function(req, res) {
        models.Batch.find()
            .exec(handleQueryResult(res));
    });

    app.get('/batches/:batchId', function(req, res) {
        var query = models.Batch.findOne({_id:new ObjectId(req.params.batchId)});
        console.log("Params", req.params);
        if(req.query.includeReports)
            query = query.populate("reports");

        query.exec(handleQueryResult(res));
    });

    app.put('/batches/:batchId', function(req, res) {
        var id = new ObjectId(req.params.batchId);
        var batch = req.body;
        delete batch._id;
        models.Batch.findOneAndUpdate({_id:id}, batch,
            handleQueryResult(res))
    });

    app.del('/batches/:batchId', function(req, res) {
        models.Batch.findOne({_id:new ObjectId(req.params.batchId)})
            .remove(function(err, result){
                console.log("Deleting:", result);
                res.send({_id:req.params.batchId});
            });
    });

    app.post('/batches', function(req, res) {
        console.log("Saving Batch", req.body);
        var batch = new models.Batch(req.body);
        batch.save(handleQueryResult(res));
    });

}
