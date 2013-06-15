module.exports = function(mongoose){
    var AbCompareResultSchema = new mongoose.Schema({
        timestamp:{type:String},
        resultA:{type:String},
        thumbA:{type:String},
        resultB:{type:String},
        thumbB:{type:String},
        image:{type:String},
        warning:{type:String},

        distortion:{type:Number, default:0},
        error:{}
    });

    var AbCompareResult = mongoose.model('abcompare-results', AbCompareResultSchema);

    return AbCompareResult;
}