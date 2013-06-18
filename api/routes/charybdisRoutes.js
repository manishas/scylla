module.exports = function(app, models, controllers){
    var utils = require('./routeUtils');


    app.get('/batches/:batchId/run', function(req, res) {
        controllers.charybdis.executeOnBatch(req.params.batchId)
            .then(utils.success(res), utils.fail(res));
    });

    app.get('/abcompares/:compareId/run', function(req, res) {
        controllers.charybdis.executeABCompare(req.params.compareId)
            .then(utils.success(res), utils.fail(res));
    });
}