var expect = require('chai').expect;
var log = require('../../../config/logging')(false);
var config = require('./databaseTestConfig');
var Page = require('../../../api/models')(log, config, true ).Page;

describe('Page Spec', function(){

    /**
     * Properties
     */

    it('has id', function(){
        expect(Page.rawAttributes.id).to.exist;
    });
    it('has url', function(){
        expect(Page.rawAttributes.url).to.exist;
    });
    it('has name', function(){
        expect(Page.rawAttributes.name).to.exist;
    });


    /**
     * Validations
     */

    it('requires url', function(done){
        Page.create({name:'Test'})
            .error(function(errors){
                expect(errors.url[0]).to.equal('Validation notEmpty failed: url');
                expect(errors.url[1]).to.equal('Validation notNull failed: url');
                done();
            })
    });

    it('requires name', function(done){
        Page.create({url:'http://test/'})
            .error(function(errors){
                expect(errors.name[0]).to.equal('Validation notEmpty failed: name');
                expect(errors.name[1]).to.equal('Validation notNull failed: name');
                done();
            })
    });


    /**
     * Relationships
     */
    it('HasMany Snapshots', function(){
        expect(Page.associations.PagesSnapshots).to.exist;
        expect(Page.associations.PagesSnapshots.associationType).to.equal('HasMany');
    });
});

