module.exports = function(app, models, schedController, executeBatch){
    var Q = require('q');
    var ObjectId = require('mongoose').Types.ObjectId;
    var commonController = require('./commonController')(ObjectId);

    var execDeferredBridge = commonController.execDeferredBridge;
    var execDeferredDeleteBridge = commonController.execDeferredDeleteBridge;

    var toObjectIdArray = commonController.toObjectIdArray;

    var find = function find(includeResults){
        var deferred = Q.defer();
        var q = models.Batch.find();
        if(includeResults) q = q.populate({path:"results", options:{sort:{end:-1}}});

        q.exec(execDeferredBridge(deferred));
        return deferred.promise;
    };

    var findById = function findById(id, includeReports, includeResults){
        var deferred = Q.defer();
        var q = models.Batch.findOne({_id:new models.ObjectId(id)});
        if(includeReports) q = q.populate("reports masterResult");
        if(includeResults) q = q.populate({path:"results", options:{sort:{end:-1}}});
        q.exec(execDeferredBridge(deferred));
        return deferred.promise/*
            .then(function(batch){
                if(includeReports){
                    var deferredPop = Q.defer();
                    return models.Report.populate(batch.reports, "masterResult")
                        .exec(execDeferredBridge(deferredPop))
                }
                return batch;
            })*/;
    };

    var update = function update(batchId, batch){
        var deferred = Q.defer();
        var id = new ObjectId(batchId);
        delete batch._id;
        delete batch.reports;
        delete batch.results;
        models.Batch.findOneAndUpdate({_id:id}, batch,
            execDeferredBridge(deferred));
        return deferred.promise;
    };

    var remove = function remove(batchId){
        var deferred = Q.defer();
        models.Report.findOne({_id:new models.ObjectId(batchId)})
            .remove(execDeferredDeleteBridge(deferred));
        return deferred.promise
            .then(function(result){
                schedController.removeBatchFromSchedule(batchId);
                return result;
            });
    };

    var createNew = function createNew(reportJSON){
        var batch = new models.Batch(reportJSON);
        batch.qSave = Q.nfbind(batch.save.bind(batch));
        return batch.qSave()
            .then(commonController.first)
            .then(function(batch){
                if(batch) schedController.addBatchToSchedule(batch, executeBatch(batch._id));
            });
    };

    var addReportToBatch = function addReportToBatch(reports, batchId){
        return models.Batch.qFindOne({_id: new ObjectId(batchId)})
            .then(function(batch){
                batch.reports.addToSet(toObjectIdArray(reports));
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
        addReportToBatch:addReportToBatch
    };

};
