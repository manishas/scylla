module.exports = function(mongoose){
    var ReportSchema = new mongoose.Schema({
        url:{type:String},
        name:{type:String},
        masterResult:{type : mongoose.Schema.ObjectId, ref : 'report-results'}
    });

    var Reports = mongoose.model('reports', ReportSchema);

    return Reports;
}