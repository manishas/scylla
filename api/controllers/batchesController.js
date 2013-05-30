module.exports = function(app, models){
    var ObjectId = require('mongoose').Types.ObjectId;

    var send = function generateSend(res){
        return function sendResponse(body){
            console.log("Sending Response: ", body.length);
            res.send(body);
        }
    }

    var sendErr = function generateErr(res){
        return function sendError(err){
            res.send(500, body);
        }
    }

    app.get('/batches', function(req, res) {
        models.Batches.find()
            .exec()
            .then(send(res), sendErr(res))
    });

    app.get('/batches/:batchId', function(req, res) {
        var query = models.Batches.findOne({_id:new ObjectId(req.params.batchId)});
        console.log("Params", req.params);
        if(req.query.includeReports)
            query = query.populate("reports");

        query.exec()
            .then(send(res), sendErr(res))
    });

    app.put('/batches/:batchId', function(req, res) {
        var id = new ObjectId(req.params.batchId);
        var batch = req.body;
        delete batch._id;
        models.Batches.findOneAndUpdate({_id:id}, batch,
            function(err, result){
                console.log(err);
                res.send(result);
            })
    });

    app.del('/batches/:batch', function(req, res) {
        models.Batches.findOne({_id:new ObjectId(req.params.batchId)})
            .remove(function(err, result){
                console.log("Deleting:", result);
                res.send({_id:req.params.batchId});
            });
    });

    app.post('/batches', function(req, res) {
        console.log("Saving Batch", req.body);
        var batch = new models.Batches(req.body);
        batch.save(function(err, result){
            res.send(result);
        });
    });

}
