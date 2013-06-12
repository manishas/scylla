module.exports = function(mongoose){
    var AbCompareResultSchema = new mongoose.Schema({
        timestamp:{type:String},
        resultA:{type:String},
        resultB:{type:String},
        image:{type:String},

        distortion:{type:Number, default:0},
        error:{}
    });

    var AbCompareResult = mongoose.model('abcompare-results', AbCompareResultSchema);

    return AbCompareResult;
}