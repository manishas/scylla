var expect = require('chai').expect;
var assert = require('assert');
var Mocha = require('mocha');
require("mocha-as-promised")();

var host = "localhost";
var port = "3000";

var h = require('../util/asyncHelpers.js')(host, port);

describe("Reports", function(){

    it('gets a list of reports', function(){
        return h.getJsonObject(h.getRequest("/reports/"))
            .then(function(reports){
                expect(reports).to.be.instanceof(Array);
            })
    });

    it('has all of the CRUD', function(){
        var report = {
            name:"Mocha Test Report Creation",
            url:"http://google.com/"
        }
        var reportId;
        return h.getJsonObject(h.postRequest("/reports", report))
            //Create
            .then(function(savedReport){
                expect(savedReport._id).to.exist;
                reportId = savedReport._id;
                expect(savedReport.name).to.equal(report.name);
                expect(savedReport.url).to.equal(report.url);
                return savedReport;
            })
            //Update
            .then(function(savedReport){
                var editedReport = {
                    _id:savedReport._id,
                    name:"Mocha Test Report Edited",
                    url:"http://google.com"
                }
                return h.getJsonObject(h.putRequest("/reports/" + savedReport._id, editedReport))
                    .then(function(newEditedReport){
                        expect(newEditedReport._id).to.equal(editedReport._id);
                        expect(newEditedReport.name).to.equal(editedReport.name);
                        expect(newEditedReport.url).to.equal(editedReport.url);
                        return newEditedReport;
                    })
            })
            //Read
            .then(function(savedReport){
                return h.getJsonObject(h.getRequest("/reports/" + savedReport._id))
                    .then(function(singleReport){
                        expect(singleReport._id).to.equal(savedReport._id);
                        expect(singleReport.name).to.equal(savedReport.name);
                        expect(singleReport.url).to.equal(savedReport.url);
                        return savedReport;
                    })
            })
            //Delete
            .then(function(savedReport){
                return h.getJsonObject(h.delRequest("/reports/" + savedReport._id, savedReport))
                    .then(function(deletedReport){
                        expect(deletedReport._id).to.equal(savedReport._id);
                        return deletedReport;
                    })
            })
            .then(function(deletedReport){
                return h.getJsonObject(h.getRequest("/reports/" + deletedReport._id))
                    .then(function(ohNo){
                        expect(ohNo).to.equal(undefined);
                        return;
                    }, function(error){
                        expect(error.message).to.equal("404");
                        return;
                    })
            })
    });

});