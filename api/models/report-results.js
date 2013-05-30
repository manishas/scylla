module.exports = function(mongoose){
    var ReportResultSchema = new mongoose.Schema({
        report:{type : mongoose.Schema.ObjectId, ref : 'reports'},
        timestamp:{type:String},
        result:{type:String},
        diff:{type:String}
    });

    var ReportResults = mongoose.model('report-results', ReportResultSchema);

    return ReportResults;
}