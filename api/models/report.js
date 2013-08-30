module.exports = function(mongoose){
    'use strict';
    var Q = require('q');

    var ReportSchema = new mongoose.Schema({
        url:{type:String},
        name:{type:String},
        masterResult:{type : mongoose.Schema.ObjectId, ref : 'report-results'},
        results:[{type : mongoose.Schema.ObjectId, ref : 'report-results'}]
    });

    var Report = mongoose.model('reports', ReportSchema);
    Report.qFind = Q.nfbind(Report.find.bind(Report));
    Report.qFindOne = Q.nfbind(Report.findOne.bind(Report));

    return Report;
};