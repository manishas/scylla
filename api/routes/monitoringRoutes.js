module.exports = function(app){
    'use strict';

    app.get('/monitoring', function(req, res) {
        res.send({
            alive:true
        });
    });

};