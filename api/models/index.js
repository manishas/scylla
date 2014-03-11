
var Sequelize = require("sequelize");

var initModels = function initModels(log, databaseConfig, sync){
    var models = {};
    var relationships = {};
    var modelInfos = {};
    var db = new Sequelize('scylla', databaseConfig.user, databaseConfig.password, databaseConfig.properties);
    var modelNames = ['page','snapshot'];
    log.info("Initializing Models");

    modelNames.forEach(function(modelName){
        var modelInfo = require('./' + modelName)(Sequelize);
        modelInfos[modelInfo.name] = modelInfo;
        models[modelInfo.name] = db.define(modelInfo.name, modelInfo.schema, modelInfo.options);
        if(modelInfo.hasOwnProperty("relationships")){
            relationships[modelInfo.name] = modelInfo.relationships;
        }
        log.info("Model Initialized: " + modelInfo.name);
    });

    for(var modelName in relationships){
        var relation = relationships[modelName];
        for(var relName in relation){
            var related = relation[relName];
            log.info(related)
            models[modelName][relName](models[related]);
        }
    }

    //TODO: Ensure this doesn't destroy data
    if(sync) db.sync();
    return models;
};
module.exports = initModels;