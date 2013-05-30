// development.js

var express = require('express');
var app = express();
var nodemailer = require('nodemailer');
var MemoryStore = require('connect').session.MemoryStore;

var mongoose = require('mongoose');
mongoose.set('debug', true);

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
    Batch       : require('./api/models/batch')(mongoose)
}
var controllers = {
    account      : require('./api/controllers/accountController')(app, models),
    reports      : require('./api/controllers/reportsController')(app, models),
    reportResults: require('./api/controllers/reportResultsController')(app, models),
    batches      : require('./api/controllers/batchesController')(app, models)
}


app.listen(3000);
