console.log("----------- Get Report: " + this.id + " -------------");
if(this.masterResultId){
    dpd.reportresults.get({id:this.masterResultId},function(result){
        this.masterResult = result;
    });
}
if(query.include === 'results') {

  dpd.reportresults.get({reportId: this.id}, function(results) {
    this.results = results;
  });
}