module.exports = function(app) {
    var schedule = require('node-schedule');
    var jobs = {};

    var isUndef = function(something){
        return typeof something === "undefined";
    }

    var removeBatchFromSchedule = function(batchId) {
        if(jobs[batchId])
            jobs[batchId].cancel();
    };

    var addBatchToSchedule = function (batch, func) {
        removeBatchFromSchedule(batch._id);

        console.log(batch.schedule);
        if(isUndef(batch.schedule) ||
           isUndef(batch.schedule.days) ||
           isUndef(batch.schedule.hour) ||
           isUndef(batch.schedule.minute)) return;

        var rule        = new schedule.RecurrenceRule();
        rule.dayOfWeek  = batch.schedule.days;
        rule.hour       = batch.schedule.hour;
        rule.minute     = batch.schedule.minute;
        //jobs[batch._id] = schedule.scheduleJob(rule, func);
        var d = new Date();
        d.setSeconds(d.getSeconds() + 5);
        jobs[batch._id] = schedule.scheduleJob(d, func);

    }

    return {
        removeBatchFromSchedule:removeBatchFromSchedule,
        addBatchToSchedule:addBatchToSchedule
    }
}