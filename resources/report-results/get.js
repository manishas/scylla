if(query.exclude !== "diffs"){
    
    this.diffs = [];
    dpd.diffs.get(
        { $or:[
            {reportResultAId: this.id},
            {reportResultBId: this.id}
            ], 
        /** This seems like a bug, this certainly isn't a recursive call, but it fails without a high limit */
        $limitRecursion: 255
        
        }, function(diffs, error) {
        if(error){
            console.log("Error:", error);
        }
        if(diffs){
            this.diffs = diffs;
            this.numDiffs = diffs.length;
        } else {
            console.log("No Diffs loaded for: " + this.id);
        }
    });
}
