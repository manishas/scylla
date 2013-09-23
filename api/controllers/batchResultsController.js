module.exports = function(models){
    'use strict';
    var Q = require('q');
    var ObjectId = require('mongoose').Types.ObjectId;
    var commonController = require('./commonController')(ObjectId);

    var execDeferredBridge = commonController.execDeferredBridge;
    var execDeferredDeleteBridge = commonController.execDeferredDeleteBridge;

    var find = function find(){
        var deferred = Q.defer();
        models.BatchResult.find()
            .exec(execDeferredBridge(deferred));
        return deferred.promise;
    };


    var findById = function findById(resultId){
        var deferred = Q.defer();
        models.BatchResult.findOne({_id:new ObjectId(resultId)})
            .exec(execDeferredBridge(deferred));
        return deferred.promise;
    };

    var update = function update(resultId, result){
        var deferred = Q.defer();
        var id = new ObjectId(resultId);
        delete result._id;
        models.BatchResult.findOneAndUpdate({_id:id}, result,
            execDeferredBridge(deferred));
        return deferred.promise;
    };

    var remove = function remove(resultId){
        var deferred = Q.defer();
        models.BatchResult.findOne({_id:new models.ObjectId(resultId)})
            .remove(execDeferredDeleteBridge(deferred));
        return deferred.promise;

    };


    var createNew = function createNew(resultJSON){
        //console.log(require('util').inspect(resultJSON));
        console.log("Creating New Batch Result");
        return models.Batch.qFindOne(resultJSON.batch._id)
            .then(function(batch){
                resultJSON.batch = batch;
                console.log("Adding Result to Batch: " + batch._id);
                var result = new models.BatchResult(resultJSON);
                result.qSave = Q.nfbind(result.save.bind(result));
                return result.qSave()
                    .then(commonController.first);

            });
    };
    var addResultToBatch = function(batchId, result){
        return models.Batch.qFindOne({_id: new ObjectId(batchId)})
            .then(function (batch) {
                //console.log("AddResultToReport", report);
                if(batch.results){
                    batch.results.push(result);
                }else{
                    batch.results = [result];
                }
                batch.qSave = Q.nfbind(batch.save.bind(batch));
                return batch.qSave()
                    .then(commonController.first);
            });
    };


    return {
        find:find,
        findById:findById,
        update:update,
        remove:remove,
        createNew:createNew,
        addResultToBatch:addResultToBatch
    };
};
