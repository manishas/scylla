module.exports = function(LOG, server, models, controllers){
    'use strict';
    var utils = require('./routeUtils');


    server.post('/pages/:pageId/captureSnapshot', function(req, res, next){
        var pageId = req.params.pageId;
        return controllers.pages.findById(pageId)
            .then(function(page){
                return controllers.charybdis.webPageToSnapshot(page.url, 800, 800);
            })
            .then(function(snapshotResult){

                var fileContents = snapshotResult.image.contents;
                delete snapshotResult.image.contents;

                return controllers.image.saveSnapshotImage(pageId, fileContents)
                    .then(function(filePath){
                        LOG.info(snapshotResult);

                        snapshotResult.image.url = filePath;
                        return snapshotResult;
                    })
            })
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));
    });
    /*

    server.get('/reports/:reportId/run', function(req, res, next){
        controllers.charybdis.executeOnReport(req.params.reportId)
            .then(utils.success(res, next), utils.fail(res, next));
    });

    server.get('/batches/:batchId/run', function(req, res, next) {
        controllers.charybdis.executeOnBatch(req.params.batchId)
            .then(utils.success(res, next), utils.fail(res, next));
    });

    server.get('/abcompares/:compareId/run', function(req, res, next) {
        controllers.charybdis.executeABCompare(req.params.compareId)
            .then(utils.success(res, next), utils.fail(res, next));
    });
    */
};