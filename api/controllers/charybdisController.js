module.exports = function(host, port){
    'use strict';
    var charybdis = require("charybdis")();

    var captureReportSnapshot = function captureReportSnapshot(reportId){
        return charybdis.captureReportSnapshot(host, port, reportId);
    };

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
        captureReportSnapshot:captureReportSnapshot,
        executeOnBatch:executeOnBatch,
        executeABCompare:executeABCompare
    };
};