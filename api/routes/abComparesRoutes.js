module.exports = function(app, models, controllers){
    'use strict';
    var utils = require('./routeUtils');



    app.get('/abcompares', function(req, res) {
        controllers.abCompares.find()
            .then(utils.success(res), utils.fail(res));

    });


    app.get('/abcompares/:abCompareId', function(req, res) {
        controllers.abCompares
            .findById(req.params.abCompareId,
                      req.query.includeFullImage,
                      req.query.includeResults)
            .then(utils.success(res), utils.fail(res));
    });


    app.del('/abcompares/:abCompareId', function(req, res) {
        controllers.abCompares
            .remove(req.params.abCompareId)
            .then(function(deleteResults){
                if(deleteResults.records === 0){ throw new Error("No Record Deleted"); }
                return { _id:req.params.abCompareId };
            })
            .then(utils.success(res), utils.fail(res));
    });

    var abValidators = {
        name:utils.v.required,
        urlA:utils.v.required,
        urlB:utils.v.required
    };

    app.post('/abcompares', function(req, res) {
        //console.log("Saving AB Compare", req.body);
        utils.validateInputs(req.body, abValidators)
            .then(function(body){
                controllers.abCompares
                    .createNew(body)
                    .then(utils.success(res), utils.fail(res));

            }, function(message){
                res.send(400, message);
            });
    });

    app.put('/abcompares/:abCompareId', function(req, res) {
        //console.log("Updating:", req.body);
        utils.validateInputs(req.body, abValidators)
            .then(function(){
                controllers.abCompares
                    .update(req.params.abCompareId, req.body)
                    .then(utils.success(res), utils.fail(res));

            }, function(message){
                res.send(400, message);
            });
    });

};