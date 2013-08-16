module.exports = function(app, models){
    var Q = require('q');
    var ObjectId = require('mongoose').Types.ObjectId;
    var commonController = require('./commonController')(ObjectId);

    var execDeferredBridge = commonController.execDeferredBridge;
    var execDeferredDeleteBridge = commonController.execDeferredDeleteBridge;

    var find = function find(){
        var deferred = Q.defer();
        models.ReportResult.find()
            .populate("report")
            .exec(execDeferredBridge(deferred));
        return deferred.promise;
    };

    var findById = function findById(resultId){
        var deferred = Q.defer();
        models.ReportResult.findOne({_id:new ObjectId(resultId)})
            .populate("report")
            .exec(execDeferredBridge(deferred));
        return deferred.promise;
    };

    var update = function update(resultId, result){
        var deferred = Q.defer();
        var id = new ObjectId(resultId);
        delete result._id;
        models.ReportResult.findOneAndUpdate({_id:id}, result,
            execDeferredBridge(deferred));
        return deferred.promise;
    };

    var remove = function remove(resultId){
        var deferred = Q.defer();
        models.ReportResult.findOne({_id:new models.ObjectId(resultId)})
            .remove(execDeferredDeleteBridge(deferred));
        return deferred.promise;

    };

    var createNew = function createNew(resultJSON){
        //console.log(require('util').inspect(resultJSON));
        return models.Report.qFindOne(resultJSON.report._id)
            .then(function(report){
                resultJSON.report = report;
                var result = new models.ReportResult(resultJSON);
                result.qSave = Q.nfbind(result.save.bind(result));
                return result.qSave()
                    .then(commonController.first);

            })
    };

    return {
        find:find,
        findById:findById,
        update:update,
        remove:remove,
        createNew:createNew
    };
}
