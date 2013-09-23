module.exports = function(server, models, controllers){
    'use strict';
    var utils = require('./routeUtils');



    server.get('/abcompares', function(req, res, next) {
        controllers.abCompares.find()
            .then(utils.success(res, next), utils.fail(res, next));

    });


    server.get('/abcompares/:abCompareId', function(req, res, next) {
        controllers.abCompares
            .findById(req.params.abCompareId,
                      req.query.includeFullImage,
                      req.query.includeResults)
            .then(utils.success(res, next), utils.fail(res, next));
    });


    server.del('/abcompares/:abCompareId', function(req, res, next) {
        controllers.abCompares
            .remove(req.params.abCompareId)
            .then(function(deleteResults){
                if(deleteResults.records === 0){ throw new Error("No Record Deleted"); }
                return { _id:req.params.abCompareId };
            })
            .then(utils.success(res, next), utils.fail(res, next));
    });

    var abValidators = {
        name:utils.v.required,
        urlA:utils.v.required,
        urlB:utils.v.required
    };

    server.post('/abcompares', function(req, res, next) {
        //console.log("Saving AB Compare", req.body);
        utils.validateInputs(req.body, abValidators)
            .then(function(body){
                controllers.abCompares
                    .createNew(body)
                    .then(utils.success(res, next), utils.fail(res, next));

            }, function(message){
                res.send(400, message);
            });
    });

    server.put('/abcompares/:abCompareId', function(req, res, next) {
        //console.log("Updating:", req.body);
        utils.validateInputs(req.body, abValidators)
            .then(function(){
                controllers.abCompares
                    .update(req.params.abCompareId, req.body)
                    .then(utils.success(res, next), utils.fail(res, next));

            }, function(message){
                res.send(400, message);
            });
    });

};