module.exports = function(mongoose){
    var DiffSchema = new mongoose.Schema({
        report:{type : mongoose.Schema.ObjectId, ref : 'reports'},
        reportResultA:{type : mongoose.Schema.ObjectId, ref : 'report-results'},
        reportResultAName:{type:String},
        reportResultB:{type : mongoose.Schema.ObjectId, ref : 'report-results'},
        reportResultBName:{type:String},

        distortion:{type:Number, default:0},
        image:{type:String},

        meta:{}
    });

    var Diff = mongoose.model('diffs', DiffSchema);

    return Diff;
}