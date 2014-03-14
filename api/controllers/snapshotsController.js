module.exports = function(LOG, models, io){
    'use strict';
    var Q = require('q');
    var shared = require('./commonController')(LOG);


    var list = function list(){
        return Q(models.Snapshot.findAll());
    };

    var findById = function findById(id){
        return Q(models.Snapshot.find(id));
    };

    var create = function create(properties, pageId){
        properties.PageId = pageId;
        return shared.buildAndValidateModel(models.Snapshot, properties);
    };

    var update = function update(id, properties){
        return Q(models.Snapshot.find(id)
            .success(function(snapshot){
                return snapshot.updateAttributes(properties);
            }));
    };

    var destroy = function destroy(id){
        return Q(models.Snapshot.find(id)
            .success(function(snapshot){
                return snapshot.destroy()
                    .success(function(){
                        return undefined;
                    });
            }));
    };

    return {
        list:list,
        create:create,
        update:update,
        findById:findById,
        destroy:destroy
    };

};