if(this.masterResult){
    dpd.reportresults.get({id:this.masterResult},function(result){
        this.masterResult = result;
    });
}
if(query.include === 'results') {
    
  dpd.reportresults.get({report: this.id}, function(results) {
    this.results = results;
  });
}