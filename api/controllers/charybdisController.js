module.exports = function(app, host, port){
    var charybdis = require("../../../charybdis/src/charybdis")();

    app.get('/batches/:batchId/run', function(req, res) {
        charybdis.executeOnBatch(host, port, req.params.batchId)
            .then(function(result){
                console.log("All Done", result);
                res.send(200, result);
            }, function(error){
                console.log("Error", error);
            });
    });

    app.get('/abcompares/:compareId/run', function(req, res) {
        charybdis.executeABCompare(host, port, req.params.compareId)
            .then(function(result){
                console.log("All Done", result);
                res.send(200, result);
            }, function(error){
                console.log("Error", error);
            });
    });
}