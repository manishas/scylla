module.exports = function(server){
    'use strict';

    server.get('/monitoring', function(req, res, next) {
        res.send({
            alive:true
        });
        return next();
    });

    server.post('/echo', function(req, res, next) {
        res.send(req.body);
        return next();
    });
};