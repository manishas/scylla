module.exports = function(app, models, controllers){
    var utils = require('./routeUtils');



    app.get('/abcompares', function(req, res) {
        controllers.abCompares.find()
            .then(utils.success(res), utils.fail(res))

    });


    app.get('/abcompares/:abCompareId', function(req, res) {
        controllers.abCompares
            .findById(req.params.abCompareId,
                      req.query.includeFullImage,
                      req.query.includeResults)
            .then(utils.success(res), utils.fail(res))
    });

    app.put('/abcompares/:abCompareId', function(req, res) {
        controllers.abCompares
            .update(req.params.abCompareId, req.body)
            .then(utils.success(res), utils.fail(res));
    });

    app.del('/abcompares/:abCompareId', function(req, res) {
        controllers.abCompares
            .remove(req.params.abCompareId)
            .then(utils.success(res), utils.fail(res));
    });

    app.post('/abcompares', function(req, res) {
        console.log("Saving AB Compare", req.body);
        controllers.abCompares
            .createNew(req.body)
            .then(utils.success(res), utils.fail(res));
    });


}
