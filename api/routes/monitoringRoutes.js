module.exports = function(app, models, controllers){


    app.get('/monitoring', function(req, res) {
        res.send({
            alive:true
        });
    });

}