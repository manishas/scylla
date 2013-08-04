module.exports = function(app, host, port){
    var charybdis = require("charybdis")();

    var executeOnReport = function executeOnReport(reportId){
        return charybdis.executeOnReport(host, port, reportId);
    };

    var executeOnBatch = function executeOnBatch(batchId){
        return charybdis.executeOnBatch(host, port, batchId);
    };

    var executeABCompare = function executeABCompare(batchId){
        return charybdis.executeABCompare(host, port, batchId);
    };

    return {
        executeOnReport:executeOnReport,
        executeOnBatch:executeOnBatch,
        executeABCompare:executeABCompare
    }
}