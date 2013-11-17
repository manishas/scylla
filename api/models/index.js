
var Sequelize = require("sequelize");

var initModels = function initModels(databaseConfig, sync){
    var models = {};
    var modelInfos = {};
    var db = new Sequelize('scylla', databaseConfig.user, databaseConfig.password, databaseConfig.properties);
    var modelNames = ['page','snapshot'];
    console.log("Initializing Models");

    modelNames.forEach(function(modelName){
        var modelInfo = require('./' + modelName)(Sequelize);
        modelInfos[modelInfo.name] = modelInfo;
        models[modelInfo.name] = db.define(modelInfo.name, modelInfo.schema, modelInfo.options);
        console.log("Model Initialized: " + modelInfo.name);
    });

    //TODO: Ensure this doesn't destroy data
    if(sync) db.sync();
    return models;
};
module.exports = initModels;