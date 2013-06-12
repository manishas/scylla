var request = require('supertest');
var express = require('express');
var MemoryStore = require('connect').session.MemoryStore;
var sinon = require('sinon');
var Q = require('q');

var app = express();
app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({secret: "Scylla", store: new MemoryStore()}));
});

var models = {
    Account:function(){return{};}
};
var controllers = {
    account:require('../../../api/controllers/accountController')(app, models)
}
var routes = {
    account:require("../../../api/routes/accountRoutes")(app, models, controllers)
}


var getResolvedPromise = function(value){
    var d = Q.defer();
    d.resolve(value);
    return d.promise;
}

describe('GET /accounts/001', function(){
    var mock;

    afterEach(function(){
        controllers.account.findById.restore();
    });

    it('respond with user', function(done){
        mock = sinon.mock(controllers.account)
            .expects("findById").once().withArgs("001")
            .returns(getResolvedPromise({"_id":"001"}));

        request(app)
            .get('/accounts/001')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect({"_id":"001"})
            .end(function(err){
                if(err) throw err;
                mock.verify();
                done();
            })
    });
    it('respond with 404', function(done){
        mock = sinon.mock(controllers.account)
            .expects("findById").once().withArgs("002")
            .returns(getResolvedPromise());

        request(app)
            .get('/accounts/002')
            .set('Accept', 'application/json')
            .expect(404)
            .end(function(err){
                if(err) throw err;
                mock.verify();
                done();
            })
    });

});


describe('GET /accounts/me', function(){
    var mock;
    afterEach(function(){
        controllers.account.findById.restore();
    });

    it('responds with user', function(done){
        mock = sinon.mock(controllers.account)
            .expects("findById").once().withArgs()
            .returns(getResolvedPromise({"_id":"003"}));

        request(app)
            .get('/accounts/me')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect({"_id":"003"})
            .end(function(err){
                if(err) throw err;
                mock.verify();
                done();
            })
    });

    it('responds with 404', function(done){
        mock = sinon.mock(controllers.account)
            .expects("findById").once().withArgs()
            .returns(getResolvedPromise());

        request(app)
            .get('/accounts/me')
            .set('Accept', 'application/json')
            .expect({})
            .end(function(err){
                if(err) throw err;
                mock.verify();
                done();
            })
    });
});

describe('POST /account/register', function(){
    var mock;
    afterEach(function(){
        controllers.account.register.restore();
    });

    it('respond with user', function(done){
        mock = sinon.mock(controllers.account)
            .expects("register").once()//.withArgs("user@user.com", "password", "name")
            .returns(getResolvedPromise({name:"name", email:"user@user.com"}));
        request(app)
            .post('/account/register')
            .send({name:"name", email:"user@user.com", password:"password"})
            .expect({name:"name", email:"user@user.com"})
            .end(function(err){
                if(err) throw err;
                mock.verify();
                done();
            });
    });

    it('fails when missing input', function(done){
        mock = sinon.mock(controllers.account)
            .expects("register").never();
        request(app)
            .post('/account/register')
            .send({email:"user@user.com", password:"password"})
            .expect(400, function(err){
                if(err) throw err;
                mock.verify();
                done();
            });
    });

});

describe('POST /account/login', function(){
    var mock;
    afterEach(function(){
        controllers.account.login.restore();
    });

    it('respond with user', function(done){
        mock = sinon.mock(controllers.account)
            .expects("login").once().withArgs("user@user.com", "password")
            .returns(getResolvedPromise({name:"name", email:"user@user.com"}));
        request(app)
            .post('/account/login')
            .send({email:"user@user.com", password:"password"})
            .expect({name:"name", email:"user@user.com"})
            .end(function(err){
                if(err) throw err;
                mock.verify();
                done();
            });
    });

    it('fails when missing no account found', function(done){
        mock = sinon.mock(controllers.account)
            .expects("login").once().withArgs("user@user.com", "NotAPassword")
            .returns(getResolvedPromise());

        request(app)
            .post('/account/login')
            .send({email:"user@user.com", password:"NotAPassword"})
            .expect(401, function(err){
                if(err) throw err;
                mock.verify();
                done();
            });
    });

});
