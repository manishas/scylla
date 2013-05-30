module.exports = function(mongoose){
    var ReportSchema = new mongoose.Schema({
        url:{type:String},
        name:{type:String},
        masterResult:{type : mongoose.Schema.ObjectId, ref : 'report-results'},
        results:[{type : mongoose.Schema.ObjectId, ref : 'report-results'}]
    });

    var Report = mongoose.model('reports', ReportSchema);

    return Report;
}