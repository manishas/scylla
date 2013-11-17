module.exports = function(server, models, controllers){
    'use strict';
    var utils = require('./routeUtils');

    server.get('/pages/:pageId/snapshots', function(req, res, next) {
        controllers.pages.list()
            .success(utils.success(res, next))
            .error(utils.fail(res, next));

    });

    server.post('/pages/:pageId/snapshots', function(req, res, next) {
        controllers.pages.create(req.body)
            .success(utils.success(res, next))
            .error(utils.fail(res, next));

    });


    server.get('/snapshots', function(req, res, next) {
        controllers.pages.list()
            .success(utils.success(res, next))
            .error(utils.fail(res, next));
    });

    server.get('/snapshots/:snapId', function(req, res, next) {
        controllers.pages.findById(req.params.id)
            .success(utils.success(res, next))
            .error(utils.fail(res, next));

    });

    server.get('/snapshots/:snapId/image', function(req, res, next) {
        controllers.pages.findById(req.params.id)
            .success(utils.success(res, next))
            .error(utils.fail(res, next));

    });

    server.get('/snapshots/:snapId/thumb', function(req, res, next) {
        controllers.pages.findById(req.params.id)
            .success(utils.success(res, next))
            .error(utils.fail(res, next));

    });

    server.put('/snapshots/:snapId', function(req, res, next) {
        controllers.pages.update(req.params.id, req.body)
            .success(utils.success(res, next))
            .error(utils.fail(res, next));

    });

    server.del('/snapshots/:snapId', function(req, res, next) {
        controllers.pages.destroy(req.params.id)
            .success(utils.successEmptyOk(res, next))
            .error(utils.fail(res, next));

    });


};
