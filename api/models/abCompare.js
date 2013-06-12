module.exports = function(mongoose){
    var AbCompareSchema = new mongoose.Schema({
        urlA:{type:String},
        urlB:{type:String},
        name:{type:String},
        thumb:{type:String},
        results:[{type : mongoose.Schema.ObjectId, ref : 'abcompare-results'}]
    });

    var AbCompare = mongoose.model('abcompare', AbCompareSchema);

    return AbCompare;
}