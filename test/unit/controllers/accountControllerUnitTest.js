
var sinon = require('sinon');
var Q = require('q');
var mongoose = require('mongoose');
var expect = require('chai').expect;

var app = {};

var models = {
    ObjectId:mongoose.Types.ObjectId,
    Account:require('../../../api/models/account')(mongoose)
};

var controller = require('../../../api/controllers/accountController')(app, models);


var getResolvedPromise = function(value){
    var d = Q.defer();
    d.resolve(value);
    return d.promise;
}
describe('accountController', function(){
    describe('findById', function(){
        var mock;

        afterEach(function(){
            models.Account.qFindOne.restore();
        });

        it('returns user when one is found', function(done){
            mock = sinon.mock(models.Account)
                .expects("qFindOne").once().withArgs({_id:new models.ObjectId("51b65c9287210b1d53000001")}, {password:0})
                .returns(getResolvedPromise({"_id":"51b65c9287210b1d53000001"}));

            controller.findById("51b65c9287210b1d53000001")
                .then(function(account){
                    expect(account._id.toString()).to.equal("51b65c9287210b1d53000001");
                    done();
                });
        });

        it('returns undefined when no user found', function(done){
            mock = sinon.mock(models.Account)
                .expects("qFindOne").once().withArgs({_id:new models.ObjectId("51b65c9287210b1d53000002")}, {password:0})
                .returns(getResolvedPromise());
            controller.findById("51b65c9287210b1d53000002")
                .then(function(account){
                    expect(typeof account).to.equal("undefined");
                    done();
                });
        });

    });

    describe('login', function(){
        var mock;

        afterEach(function(){
            models.Account.qFindOne.restore();
        });

        it('returns user when one is found', function(done){
            mock = sinon.mock(models.Account)
                .expects("qFindOne").once().withArgs({email:"user@user.com", password:"5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"}, {password:0})
                .returns(getResolvedPromise({"_id":"51b65c9287210b1d53000001"}));

            controller.login("user@user.com", "password")
                .then(function(account){
                    expect(account._id.toString()).to.equal("51b65c9287210b1d53000001");
                    done();
                });
        });

        it('returns undefined when no user found', function(done){
            mock = sinon.mock(models.Account)
                .expects("qFindOne").once().withArgs({email:"user@user.com", password:"11e56efd5eae13673eccfed917ac1d69f02a8d0b8a4c384c5cc18c1bd2b7dc29"}, {password:0})
                .returns(getResolvedPromise());
            controller.login("user@user.com", "incorrectPassword")
                .then(function(account){
                    expect(typeof account).to.equal("undefined");
                    done();
                });
        });

    });

    describe('register', function(){
        var mock;
        var findOneStub

        afterEach(function(){
            if(models.Account.prototype.save.restore)
                models.Account.prototype.save.restore();
            if(models.Account.qFindOne.restore)
                models.Account.qFindOne.restore();
        });

        it('creates a proper user account', function(done){
            mock = sinon.mock(models.Account.prototype)
                .expects("save").once()
                .callsArgWith(0, undefined, [{"_id":"51b65c9287210b1d53000001"}])

            findOneStub = sinon.stub(models.Account, "qFindOne")
                .returns(getResolvedPromise({"_id":"51b65c9287210b1d53000001"}))

            controller.register("user@user.com", "password", "The User")
                .then(function(account){
                    expect(account._id.toString()).to.equal("51b65c9287210b1d53000001");
                    done();
                });
        });

    });

});

