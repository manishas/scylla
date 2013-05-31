module.exports = function(mongoose){
    var BatchSchema = new mongoose.Schema({
        name:{type:String},
        reports:[{type : mongoose.Schema.ObjectId, ref : 'reports'}],
        results:[{type : mongoose.Schema.ObjectId, ref : 'batch-results'}]
    });

    var Batch = mongoose.model('batches', BatchSchema);

    return Batch;
}