module.exports = function(models){
    'use strict';
    var Q = require('q');
    var ObjectId = require('mongoose').Types.ObjectId;
    var commonController = require('./commonController')(ObjectId);

    var execDeferredBridge = commonController.execDeferredBridge;
    var execDeferredDeleteBridge = commonController.execDeferredDeleteBridge;

    var find = function find(){
        console.log("Reports Controller");
        var deferred = Q.defer();
        models.Report.find()
            .populate({path:"masterResult", select:"-result -thumb"})
            .exec(execDeferredBridge(deferred));
        return deferred.promise;
    };

    var findById = function findById(id, includeFullImage, includeResults){
        var deferred = Q.defer();
        var q = models.Report.findOne({_id:new models.ObjectId(id)});
        var select = (includeFullImage) ? "" : "-result";
        if(includeResults){ q = q.populate({path:"results",select:select}); }
        q.populate({path:"masterResult", select:select})
            .exec(execDeferredBridge(deferred));
        return deferred.promise;
    };

    var update = function update(reportId, report){
        var deferred = Q.defer();
        var id = new models.ObjectId(reportId);
        delete report._id;
        delete report.results;
        delete report.masterResult;
        models.Report.findOneAndUpdate({_id:id}, report,
            execDeferredBridge(deferred));
        return deferred.promise;
    };

    var remove = function remove(reportId){
        var deferred = Q.defer();
        models.Report.findOne({_id:new models.ObjectId(reportId)})
            .remove(execDeferredDeleteBridge(deferred));
        return deferred.promise;
    };

    var createNew = function createNew(reportJSON){
        var report = new models.Report(reportJSON);
        report.qSave = Q.nfbind(report.save.bind(report));
        return report.qSave()
            .then(commonController.first);
    };

    var updateReportMaster = function(reportId, resultId){
        return models.Report.qFindOne({_id: new models.ObjectId(reportId)})
            .then(function (report) {
                report.masterResult = new models.ObjectId(resultId);
                report.qSave = Q.nfbind(report.save.bind(report));
                return report.qSave();
            });
    };
    var addResultToReport = function(reportId, result){
        return models.Report.qFindOne({_id: new models.ObjectId(reportId)})
            .then(function (report) {
                //console.log("AddResultToReport", report);
                report.results.push(result);
                report.qSave = Q.nfbind(report.save.bind(report));
                return report.qSave()
                    .then(commonController.first);
            });
    };


    return {
        find:find,
        findById:findById,
        update:update,
        remove:remove,
        createNew:createNew,
        updateReportMaster:updateReportMaster,
        addResultToReport:addResultToReport
    };

};