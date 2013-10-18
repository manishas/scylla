/**
 * Scylla Server
 *
 *
 */

var cli = require('cli');

cli.parse({
    port: ['p', 'The Port Number', 'number', 3000],
    https_port: ['sp', 'The HTTPS Port Number', 'number', 3443]
});
var fs = require('fs');
var restify = require('restify');
var bunyan = require('bunyan');
var NAME = 'scylla';

// In true UNIX fashion, debug messages go to stderr, and audit records go
// to stdout, so you can split them as you like in the shell
var LOG = bunyan.createLogger({
    name: NAME,
    streams: [ {
        level: (process.env.LOG_LEVEL || 'info'),
        stream: process.stderr
    }, {
        // This ensures that if we get a WARN or above all debug records
        // related to that request are spewed to stderr - makes it nice
        // filter out debug messages in prod, but still dump on user
        // errors so you can debug problems
        level: 'debug',
        type: 'raw',
        stream: new restify.bunyan.RequestCaptureStream({
            level: bunyan.WARN,
            maxRecords: 100,
            maxRequestIds: 1000,
            stream: process.stderr
        })
    } ],
    serializers: restify.bunyan.serializers
});


cli.main(function(args, options) {

    var SendGrid = require('sendgrid').SendGrid;
    var mailConfig = require('./config/mail');

    var Q = require('q');
    Q.longStackSupport = true;
    var sendgrid = new SendGrid(mailConfig.user, mailConfig.key);

    var mongoose = require('mongoose');
    //mongoose.set('debug', true);
    mongoose.connect('mongodb://localhost/scylla');

    var models = {
        ObjectId       : mongoose.Types.ObjectId,
        AbCompare      : require('./api/models/abCompare')(mongoose),
        AbCompareResult: require('./api/models/abCompareResult')(mongoose),
        Account        : require('./api/models/account')(mongoose),
        ReportResult   : require('./api/models/reportResult')(mongoose),
        Report         : require('./api/models/report')(mongoose),
        BatchResult    : require('./api/models/batchResult')(mongoose),
        Batch          : require('./api/models/batch')(mongoose),
        ResultDiff     : require('./api/models/resultDiff')(mongoose)
    };

    var executeBatch = function (batchId) {
        return function () {
            controllers.charybdis.executeOnBatch(batchId.toString())
                .then(function (batchBundle) {
                    emailController.sendBatchResultEmail(batchBundle.batch, batchBundle.batchResult);
                }, function (error) {
                    console.log("Error running Charybdis on BatchId: ", batchId, error);
                });
        };
    };

    var schedController = require('./api/controllers/scheduleController')();
    var emailController = require('./api/controllers/emailController')(models, sendgrid);

    var controllers = {
        abCompares      : require('./api/controllers/abComparesController')(models),
        abCompareResults: require('./api/controllers/abCompareResultsController')(models),
        account         : require('./api/controllers/accountController')(models),
        reports         : require('./api/controllers/reportsController')(models),
        reportResults   : require('./api/controllers/reportResultsController')(models),
        batches         : require('./api/controllers/batchesController')(models, schedController, executeBatch),
        batchResults    : require('./api/controllers/batchResultsController')(models),
        resultDiffs     : require('./api/controllers/resultDiffsController')(models),
        charybdis       : require('./api/controllers/charybdisController')("localhost", options.port),
        schedule        : schedController,
        email           : emailController
    };


    var imageFormatter = function(res, req, body){
        if (body instanceof Error)
            res.statusCode = body.statusCode || 500;

        if (!Buffer.isBuffer(body))
            body = new Buffer(body.toString(), 'base64');

        res.setHeader('Content-Length', body.length);
        return (body);
    };

    var httpServer = restify.createServer({
        name: 'Scylla',
        log:LOG,
        formatters:{
            'image/png; q=0.3':imageFormatter
        }
    });
    var httpsServer = restify.createServer({
        name: 'Scylla Secure',
        log:LOG,
        formatters:{
            'image/png; q=0.9':imageFormatter
        },
        formatters:imageFormatter,
        key: fs.readFileSync('/etc/ssl/self-signed/server.key'),
        certificate: fs.readFileSync('/etc/ssl/self-signed/server.crt')
    });

    var setupServer = function(restServer){
        restServer.use(restify.requestLogger());
        restServer.use(restify.queryParser());
        restServer.use(restify.bodyParser());



        var routes = {
            abcompares      : require('./api/routes/abComparesRoutes')(restServer, models, controllers),
            abcompareresults: require('./api/routes/abCompareResultsRoutes')(restServer, models, controllers),
            reports         : require('./api/routes/reportsRoutes')(restServer, models, controllers),
            reportResults   : require('./api/routes/reportResultsRoutes')(restServer, models, controllers),
            resultDiffs     : require('./api/routes/resultDiffsRoutes')(restServer, models, controllers),
            batches         : require('./api/routes/batchesRoutes')(restServer, models, controllers),
            batchResults    : require('./api/routes/batchResultsRoutes')(restServer, models, controllers),
            charybdis       : require('./api/routes/charybdisRoutes')(restServer, models, controllers),
            monitoring      : require('./api/routes/monitoringRoutes')(restServer, models, controllers)
        };

        //We serve the 'static' site AFTER the API,
        restServer.get(/\//, restify.serveStatic({
            directory: './public',
            default:'index.html'
        }));
    }
    setupServer(httpServer);
    setupServer(httpsServer);


    httpServer.listen(options.port);
    httpsServer.listen(options.https_port)

    console.log("Listening on local ports: " + options.port + ", " + options.https_port);
//Initialize the schedule

    models.Batch.find(function (err, batches) {
        if (err) throw "Problem loading Batches";
        if (typeof batches.length === "undefined") batches = [batches];
        batches.forEach(function (batch) {
            controllers.schedule.addBatchToSchedule(batch, executeBatch(batch._id))
        })
    });

})
