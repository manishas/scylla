module.exports = function(mongoose){
    var BatchSchema = new mongoose.Schema({
        name:{type:String},
        watchers:[{type:String}],
        reports:[{type : mongoose.Schema.ObjectId, ref : 'reports'}],
        results:[{type : mongoose.Schema.ObjectId, ref : 'batch-results'}],
        scheduleEnabled:{type:Boolean, default:false},
        schedule:{
            days:[Number],
            hour:Number,
            minute:Number
        }
    });

    var Batch = mongoose.model('batches', BatchSchema);

    return Batch;
}