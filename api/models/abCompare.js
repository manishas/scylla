module.exports = function(mongoose){
    var Q = require('q');

    var AbCompareSchema = new mongoose.Schema({
        urlA:{type:String},
        urlB:{type:String},
        name:{type:String},
        thumbA:{type:String},
        thumbB:{type:String},
        results:[{type : mongoose.Schema.ObjectId, ref : 'abcompare-results'}]
    });

    var AbCompare = mongoose.model('abcompare', AbCompareSchema);
    AbCompare.qFind = Q.nfbind(AbCompare.find.bind(AbCompare));
    AbCompare.qFindOne = Q.nfbind(AbCompare.findOne.bind(AbCompare));

    return AbCompare;
}