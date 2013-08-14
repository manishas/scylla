module.exports = function(app, models){
    var ObjectId = require('mongoose').Types.ObjectId;

    var send = function generateSend(res){
        return function sendResponse(body){
            //console.log("Sending Response: ", body.length);
            res.send(body);
        }
    }

    var sendErr = function generateErr(res){
        return function sendError(err){
            res.send(500, body);
        }
    }

    app.get('/batch-results', function(req, res) {
        models.BatchResult.find()
            //.populate("batch")
            .exec()
            .then(send(res), sendErr(res))
    });

    app.get('/batch-results/:resultId', function(req, res) {
        models.BatchResult.findOne({_id:new ObjectId(req.params.resultId)})
            //.populate("batch")
            .exec()
            .then(send(res), sendErr(res))
    });

    app.put('/batch-results/:resultId', function(req, res) {
        var id = new ObjectId(req.params.resultId);
        var repResult = req.body;
        delete repResult._id;
        models.BatchResult.findOneAndUpdate({_id:id}, repResult,
            function(err, result){
                console.error(err);
                res.send(result);
            })
    });

    app.del('/batch-results/:resultId', function(req, res) {
        models.BatchResult.findOne({_id:new ObjectId(req.params.resultId)})
            .remove(function(err, result){
                console.log("Deleting:", result);
                res.send({_id:req.params.resultId});
            });
    });

    app.post('/batches/:batchId/results', function(req, res) {
        //console.log("Saving New Result on Batch:", req.body);
        var batchResult = new models.BatchResult(req.body);
        batchResult.save(function(err){

            models.Batch.findOne({_id:new ObjectId(req.params.batchId)},
                function(err, batch){
                    batch.results.push(batchResult);
                    batch.save(function(err){
                        res.send(batchResult);
                    })
                })
        })


    });
}
