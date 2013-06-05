module.exports = function(app, charybdis){

    app.get('/batches/:batchId/run', function(req, res) {
        charybdis.execute(req.params.batchId)
            .then(function(result){
                console.log("All Done", result);
                res.send(200, result);
            }, function(error){
                console.log("Error", error);
            });
    });
}