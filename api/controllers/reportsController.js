module.exports = function(app, models){
    var ObjectId = require('mongoose').Types.ObjectId;

    var send = function generateSend(res){
        return function sendResponse(body){
            console.log("Sending Response: ", body.length);
            res.send(body);
        }
    };

    var sendErr = function generateErr(res){
        return function sendError(err){
            res.send(500, body);
        }
    };

    app.get('/reports', function(req, res) {
        models.Report.find()
            .populate("masterResult")
            .exec()
            .then(send(res), sendErr(res))
    });

    app.get('/reports/:reportId', function(req, res) {
        var q = models.Report.findOne({_id:new ObjectId(req.params.reportId)});
        if(req.query.includeResults) q = q.populate("results");
        q.populate("masterResult")
            .exec()
            .then(send(res), sendErr(res))
    });

    app.put('/reports/:reportId', function(req, res) {
        var id = new ObjectId(req.params.reportId);
        var report = req.body;
        delete report._id;
        models.Report.findOneAndUpdate({_id:id}, report,
            function(err, result){
                console.log(err);
                res.send(result);
            })
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
        report.save(function(err, result){
            res.send(result);
        });
    });


}
