
var result = this;

dpd.diffs.get({ $or:[
        {reportResultA: this.id},
        {reportResultB: this.id}
]}, function(diffs) {
    result.diffs = diffs;
});
