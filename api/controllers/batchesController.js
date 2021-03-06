module.exports = function(models, schedController, executeBatch){
    'use strict';
    var Q = require('q');
    var ObjectId = require('mongoose').Types.ObjectId;
    var commonController = require('./commonController')(ObjectId);

    var execDeferredBridge = commonController.execDeferredBridge;
    var execDeferredDeleteBridge = commonController.execDeferredDeleteBridge;

    var toObjectIdArray = commonController.toObjectIdArray;

    var find = function find(includeResults){
        var deferred = Q.defer();
        var q = models.Batch.find();
        if(includeResults){ q = q.populate({path:"results", options:{sort:{end:-1}}}); }

        q.exec(execDeferredBridge(deferred));
        return deferred.promise;
    };

    var findById = function findById(id, includeReports, includeResults){
        var deferred = Q.defer();
        var q = models.Batch.findOne({_id:new models.ObjectId(id)});
        if(includeReports){ q = q.populate("reports"); }
        if(includeResults){ q = q.populate({path:"results", options:{sort:{end:-1}}}); }
        q.exec(execDeferredBridge(deferred));
        return deferred.promise
            .then(function(batch){
                //If we have the reports, we probably want the MasterResult, as that has the thumbnail for the report
                if(includeReports){
                    var deferredPop = Q.defer();
                    //I really don't like this, but for some reason this populate call has to have a CB passed in, rather
                    //Than using exec() like everything else.
                    models.Report.populate(batch.reports, "masterResult",
                        function(err, reports){
                            if(err){
                                deferredPop.reject(err);
                            } else {
                                batch.reports = reports;
                                deferredPop.resolve(batch);
                            }
                        });
                    return deferredPop.promise;
                }
                return batch;
            });
    };

    var update = function update(batchId, batch){
        var deferred = Q.defer();
        var id = new ObjectId(batchId);
        delete batch._id;
        delete batch.reports;
        delete batch.results;
        models.Batch.findOneAndUpdate({_id:id}, batch,
            execDeferredBridge(deferred));
        return deferred.promise
            .then(function(savedBatch){
                if(savedBatch){ schedController.addBatchToSchedule(savedBatch, executeBatch(savedBatch._id)); }
                return savedBatch;
            });
    };

    var remove = function remove(batchId){
        var deferred = Q.defer();
        models.Batch.findOne({_id:new models.ObjectId(batchId)})
            .remove(execDeferredDeleteBridge(deferred));
        return deferred.promise
            .then(function(result){
                schedController.removeBatchFromSchedule(batchId);
                return result;
            });
    };

    var removeReportFromBatch = function removeReportFromBatch(batchId, reportId){
        return findById(batchId)
            .then(function(batch){
                batch.reports.remove(new ObjectId(reportId));
                batch.qSave = Q.nfbind(batch.save.bind(batch));
                return batch.qSave()
                    .then(function(){
                        return findById(batchId, true, true);
                    });
            });
    };

    var createNew = function createNew(reportJSON){
        var batch = new models.Batch(reportJSON);
        batch.qSave = Q.nfbind(batch.save.bind(batch));
        return batch.qSave()
            .then(commonController.first)
            .then(function(batch){
                if(batch){ schedController.addBatchToSchedule(batch, executeBatch(batch._id)); }
                return batch;
            });
    };

    var addReportToBatch = function addReportToBatch(reports, batchId){
        return models.Batch.qFindOne({_id: new ObjectId(batchId)})
            .then(function(batch){
                batch.reports.addToSet.apply(batch.reports, toObjectIdArray(reports));
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
        addReportToBatch:addReportToBatch,
        removeReportFromBatch:removeReportFromBatch
    };

};
