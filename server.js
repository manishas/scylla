// development.js

var express = require('express');
var app = express();
var MemoryStore = require('connect').session.MemoryStore;
var SendGrid = require('sendgrid').SendGrid;
var mailConfig = require('./config/mail');
var sendgrid = new SendGrid(mailConfig.user, mailConfig.key);

var mongoose = require('mongoose');
//mongoose.set('debug', true);

var charybdis = require("../charybdis/src/charybdis")("localhost", 3001);

app.configure(function () {
    app.use(express.static(__dirname + '/public'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({secret: "Scylla", store: new MemoryStore()}));
    mongoose.connect('mongodb://localhost/scylla');
});

var config = {
    mail: require('./config/mail')
}

var models = {
    ObjectId       : mongoose.Types.ObjectId,
    AbCompare      : require('./api/models/abCompare')(mongoose),
    AbCompareResult: require('./api/models/abCompareResult')(mongoose),
    Account        : require('./api/models/account')(mongoose),
    ReportResult   : require('./api/models/reportResult')(mongoose),
    Report         : require('./api/models/report')(mongoose),
    BatchResult    : require('./api/models/batchResult')(mongoose),
    Batch          : require('./api/models/batch')(mongoose),
    Diff           : require('./api/models/diff')(mongoose)
}
var executeBatch = function (batchId) {
    return function () {
        charybdis.executeOnBatch(batchId.toString())
            .then(function (batchBundle) {
                emailController.sendBatchResultEmail(batchBundle.batch, batchBundle.batchResult);
            }, function (error) {
                console.log("Error running Charybdis on BatchId: ", batchId, error);
            });
    };
};

var schedController = require('./api/controllers/scheduleController')(app);
var emailController = require('./api/controllers/emailController')(app, models, sendgrid);

var controllers = {
    abCompares      : require('./api/controllers/abComparesController')(app, models),
    abCompareResults: require('./api/controllers/abCompareResultsController')(app, models),
    account         : require('./api/controllers/accountController')(app, models),
    reports         : require('./api/controllers/reportsController')(app, models),
    reportResults   : require('./api/controllers/reportResultsController')(app, models),
    batches         : require('./api/controllers/batchesController')(app, models, schedController, executeBatch),
    batchResults    : require('./api/controllers/batchResultsController')(app, models),
    diffs           : require('./api/controllers/diffsController')(app, models),
    charybdis       : require('./api/controllers/charybdisController')(app, charybdis),
    schedule        : schedController,
    email           : emailController
}
var routes = {
    abcompares      : require('./api/routes/abComparesRoutes')(app, models, controllers),
    abcompareresults: require('./api/routes/abCompareResultsRoutes')(app, models, controllers),
    account         : require('./api/routes/accountRoutes')(app, models, controllers),
    reports         : require('./api/routes/reportsRoutes')(app, models, controllers),
    reportResults   : require('./api/routes/reportResultsRoutes')(app, models, controllers)
}

app.listen(3000);

//Initialize the schedule

models.Batch.find(function (err, batches) {
    if (err) throw "Problem loading Batches";
    if (typeof batches.length === "undefined") batches = [batches];
    batches.forEach(function (batch) {
        controllers.schedule.addBatchToSchedule(batch, executeBatch(batch._id))
    })
});



