// development.js

var express = require('express');
var app = express();
var nodemailer = require('nodemailer');
var MemoryStore = require('connect').session.MemoryStore;

var mongoose = require('mongoose');
mongoose.set('debug', true);

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
    Account     : require('./api/models/account')(config, mongoose, nodemailer),
    ReportResult: require('./api/models/reportResult')(mongoose),
    Report      : require('./api/models/report')(mongoose),
    BatchResult : require('./api/models/batchResult')(mongoose),
    Batch       : require('./api/models/batch')(mongoose),
    Diff        : require('./api/models/diff')(mongoose)
}
var schedController = require('./api/controllers/scheduleController')(app);
var executeBatch = function(batchId){return function(){charybdis.execute(batchId.toString());};}
var controllers = {
    account      : require('./api/controllers/accountController')(app, models),
    reports      : require('./api/controllers/reportsController')(app, models),
    reportResults: require('./api/controllers/reportResultsController')(app, models),
    batches      : require('./api/controllers/batchesController')(app, models, schedController, executeBatch),
    batchResults : require('./api/controllers/batchResultsController')(app, models),
    diffs        : require('./api/controllers/diffsController')(app, models),
    charybdis    : require('./api/controllers/charybdisController')(app, charybdis),
    schedule     : schedController
}

app.listen(3000);

//Initialize the schedule

models.Batch.find(function(err, batches){
    if(err) throw "Problem loading Batches";
    if(typeof batches.length === "undefined") batches = [batches];
    batches.forEach(function(batch){
        controllers.schedule.addBatchToSchedule(batch, executeBatch(batch._id))
    })
});



