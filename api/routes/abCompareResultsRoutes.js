module.exports = function(app, models, controllers){
    var utils = require('./routeUtils');


    app.get('/abcompare-results', function(req, res) {
        controllers.abCompareResults.find()
            .then(utils.success(res), utils.fail(res));
    });

    app.get('/abcompare-results/:resultId', function(req, res) {
        controllers.abCompareResults.findById(req.params.resultId)
            .then(utils.success(res), utils.fail(res));

    });

    app.put('/abcompare-results/:resultId', function(req, res) {
        controllers.abCompareResults
            .update(req.params.resultId, req.body)
            .then(utils.success(res), utils.fail(res));
    });

    app.del('/abcompare-results/:resultId', function(req, res) {
        controllers.abCompareResults
            .remove(req.params.resultId)
            .then(function(deleteResults){
                if(deleteResults.records == 0) throw new Error("No Result Deleted");
                return {
                    _id:req.params.resultId
                }
            })
            .then(utils.success(res), utils.fail(res));
    });

    app.post('/abcompares/:compareId/results', function(req, res) {
        controllers.abCompareResults
            .createNew(req.body)
            .then(function(result){
                console.log("Saving Result ", result._id, " on ", req.params.compareId);
                return controllers.abCompares
                    .addResultToCompare(req.params.compareId, result)
                    .then(function(){
                        return result;
                    })
            })
            .then(utils.success(res), utils.fail(res));

    });
}
