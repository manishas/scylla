module.exports = function(app, host, port){
    var charybdis = require("charybdis")();

    var executeOnBatch = function executeOnBatch(batchId){
        return charybdis.executeOnBatch(host, port, batchId);
    };

    var executeABCompare = function executeABCompare(batchId){
        return charybdis.executeABCompare(host, port, batchId);
    };

    return {
        executeOnBatch:executeOnBatch,
        executeABCompare:executeABCompare
    }
}