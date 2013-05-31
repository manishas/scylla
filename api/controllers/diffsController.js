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

    app.get('/diffs', function(req, res) {
        models.Diff.find()
            .exec()
            .then(send(res), sendErr(res))
    });

    app.get('/diffs/:diffId', function(req, res) {
        var query = models.Diff.findOne({_id:new ObjectId(req.params.diffId)})
            .exec()
            .then(send(res), sendErr(res))
    });

    app.put('/diffs/:diffId', function(req, res) {
        var id = new ObjectId(req.params.diffId);
        var diff = req.body;
        delete diff._id;
        models.Diff.findOneAndUpdate({_id:id}, diff,
            function(err, result){
                if(err) console.log(err);
                res.send(result);
            })
    });

    app.del('/diffs/:diffId', function(req, res) {
        models.Diff.findOne({_id:new ObjectId(req.params.batchId)})
            .remove(function(err, result){
                console.log("Deleting:", result);
                res.send({_id:req.params.batchId});
            });
    });

    app.post('/diffs', function(req, res) {
        console.log("Saving Diff", req.body);
        var diff = new models.Diff(req.body);
        diff.save(function(err, result){
            res.send(result);
        });
    });

}
