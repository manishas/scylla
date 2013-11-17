module.exports = function(models){
    'use strict';


    var list = function list(){
        return models.Page.findAll();
    };

    var findById = function findById(id){
        return models.Page.find(id);
    };

    var create = function create(properties){
        return models.Page.build(properties).save();
    };

    var update = function update(id, properties){
        return models.Page.find(id)
            .success(function(page){
                return page.updateAttributes(properties);
            });
    };

    var destroy = function destroy(id){
        return models.Page.find(id)
            .success(function(page){
                return page.destroy()
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