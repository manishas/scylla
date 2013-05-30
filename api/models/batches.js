module.exports = function(mongoose){
    var BatchSchema = new mongoose.Schema({
        name:{type:String},
        reports:[{type : mongoose.Schema.ObjectId, ref : 'reports'}]
    });

    var Batches = mongoose.model('batches', BatchSchema);

    return Batches;
}