/**
 * Scylla Server
 *
 *
 */

var cli = require('cli');

cli.parse({
    port: ['p', 'The Port Number', 'number', 3000],
    https_port: ['sp', 'The HTTPS Port Number', 'number', 3443],
    syslog: ['s', 'Log to Syslog', 'boolean', false]
});
var fs = require('fs');
var restify = require('restify');
var bunyan = require('bunyan');
var NAME = 'scylla';


var getLogger = function(useSyslog){
    if(useSyslog){
        // In true UNIX fashion, debug messages go to stderr, and audit records go
        // to stdout, so you can split them as you like in the shell
        return bunyan.createLogger({
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
    } else {
        return bunyan.createLogger({
            name: NAME,
            serializers: restify.bunyan.serializers
        });
    }

}


cli.main(function(args, options) {

    var LOG = getLogger(options.syslog);

    var SendGrid = require('sendgrid').SendGrid;
    var mailConfig = require('./config/mail');
    var databaseConfig = require('./config/database');

    var Q = require('q');
    Q.longStackSupport = true;

    var sendgrid = new SendGrid(mailConfig.user, mailConfig.key);

    var models = require('./api/models')(LOG, databaseConfig, true);

    var imageFormatter = require('./api/lib/imageFormatter');

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
    var io = require('socket.io').listen(httpsServer);

    var controllers = {
        pages         : require('./api/controllers/pagesController')(models, io),
        snapshots     : require('./api/controllers/snapshotsController')(models, io)
    };

    var setupServer = function(restServer){
        restServer.use(restify.requestLogger());
        restServer.use(restify.queryParser());
        restServer.use(restify.bodyParser());

        var routes = {
            pages         : require('./api/routes/pagesRoutes')(restServer, models, controllers),
            snapshots     : require('./api/routes/snapshotsRoutes')(restServer, models, controllers)
        };

        //We serve the 'static' site AFTER the API,
        restServer.get(/\//, restify.serveStatic({
            directory: './public',
            default:'index.html'
        }));

    };


    setupServer(httpServer);
    setupServer(httpsServer);


    httpServer.listen(options.port);
    httpsServer.listen(options.https_port);

    LOG.info("Listening on local ports: " + options.port + ", " + options.https_port);



})
