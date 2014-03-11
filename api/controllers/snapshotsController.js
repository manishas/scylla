module.exports = function(models, io){
    'use strict';


    var list = function list(){
        return models.Snapshot.findAll();
    };

    var findById = function findById(id){
        return models.Snapshot.find(id);
    };

    var create = function create(properties, pageId){
        properties.PageId = pageId;
        return models.Snapshot.build(properties).save()
            .success(function(snapshot){
                
            });
    };

    var update = function update(id, properties){
        return models.Snapshot.find(id)
            .success(function(snapshot){
                return snapshot.updateAttributes(properties);
            });
    };

    var destroy = function destroy(id){
        return models.Snapshot.find(id)
            .success(function(snapshot){
                return snapshot.destroy()
                    .success(function(){
                        return undefined;
                    });
            });
    };

    return {
        list:list,
        create:create,
        update:update,
        findById:findById,
        destroy:destroy
    };

};