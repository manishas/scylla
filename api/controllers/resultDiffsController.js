module.exports = function(models){
    'use strict';
    var Q = require('q');
    var ObjectId = require('mongoose').Types.ObjectId;
    var commonController = require('./commonController')(ObjectId);

    var execDeferredBridge = commonController.execDeferredBridge;
    var execDeferredDeleteBridge = commonController.execDeferredDeleteBridge;

    var find = function find(){
        var deferred = Q.defer();
        models.ResultDiff.find()
            .exec(execDeferredBridge(deferred));
        return deferred.promise;
    };

    var findForResult = function findForResult(resultId){
        var deferred = Q.defer();
        models.ResultDiff.find({$or:[
                {reportResultA:resultId},
                {reportResultB:resultId}
            ]})
            .exec(execDeferredBridge(deferred));
        return deferred.promise;
    };

    var findById = function findById(id, includeReport, includeResults){
        var deferred = Q.defer();
        var q = models.ResultDiff.findOne({_id:new models.ObjectId(id)});
        if(includeReport){ q = q.populate("report"); }
        if(includeResults){ q = q.populate("reportResultA reportResultB"); }

        q.exec(execDeferredBridge(deferred));
        return deferred.promise;
    };

    var update = function update(id, diff){
        var deferred = Q.defer();
        var oid = new models.ObjectId(id);
        delete diff._id;
        models.ResultDiff.findOneAndUpdate({_id:oid}, diff,
            execDeferredBridge(deferred));
        return deferred.promise;
    };

    var remove = function remove(id){
        var deferred = Q.defer();
        models.ResultDiff.findOne({_id:new models.ObjectId(id)})
            .remove(execDeferredDeleteBridge(deferred));
        return deferred.promise;
    };

    var createNew = function createNew(resultDiffSrc){
        resultDiffSrc.report = new ObjectId(resultDiffSrc.report._id);
        if(resultDiffSrc.reportResultA) {
            resultDiffSrc.reportResultA = new ObjectId(resultDiffSrc.reportResultA._id);
        }
        if(resultDiffSrc.reportResultB) {
            resultDiffSrc.reportResultB = new ObjectId(resultDiffSrc.reportResultB._id);
        }
        var resultDiff = new models.ResultDiff(resultDiffSrc);
        resultDiff.qSave = Q.nfbind(resultDiff.save.bind(resultDiff));
        return resultDiff.qSave()
            .then(commonController.first);
    };

    return {
        find:find,
        findForResult:findForResult,
        findById:findById,
        update:update,
        remove:remove,
        createNew:createNew
    };

};
