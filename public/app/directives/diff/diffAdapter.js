define([
], function(
    ){
    'use strict';

    var reportResultToDiff = function(reportResultDiff){
        var diff = {
            resultA:reportResultDiff.reportResultA.result,
            resultB:reportResultDiff.reportResultB.result,
            image:reportResultDiff.image,
            warning:reportResultDiff.warning,
            error:reportResultDiff.error
        };
        return diff;
    };
    var compareResultToDiff = function(compareResult){
        var diff = {
            resultA:compareResult.resultA,
            resultB:compareResult.resultB,
            image:compareResult.image,
            warning:compareResult.warning,
            error:compareResult.error
        };
        return diff;
    };

    return {
        reportResultToDiff:reportResultToDiff,
        compareResultToDiff:compareResultToDiff
    }

})