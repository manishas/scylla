module.exports = function(server, models, controllers){
    'use strict';
    var utils = require('./routeUtils');

    server.get('/pages/:pageId/snapshots', function(req, res, next) {
        controllers.pages.list()
            .success(utils.success(res, next))
            .error(utils.fail(res, next));

    });

    server.get('/pages/:pageId/snapshots/:snapId', function(req, res, next) {
        controllers.pages.findById(req.params.id)
            .success(utils.success(res, next))
            .error(utils.fail(res, next));

    });

    server.post('/pages/:pageId/snapshots', function(req, res, next) {
        controllers.pages.create(req.body)
            .success(utils.success(res, next))
            .error(utils.fail(res, next));

    });

    server.put('/pages/:pageId/snapshots/:snapId', function(req, res, next) {
        console.log("Updating");
        controllers.pages.update(req.params.id, req.body)
            .success(utils.success(res, next))
            .error(utils.fail(res, next));

    });

    server.del('/pages/:pageId/snapshots/:snapId', function(req, res, next) {
        controllers.pages.destroy(req.params.id)
            .success(utils.successEmptyOk(res, next))
            .error(utils.fail(res, next));

    });


};
