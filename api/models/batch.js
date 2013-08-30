module.exports = function(mongoose){
    'use strict';
    var Q = require('q');

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
    Batch.qFind = Q.nfbind(Batch.find.bind(Batch));
    Batch.qFindOne = Q.nfbind(Batch.findOne.bind(Batch));

    return Batch;
};