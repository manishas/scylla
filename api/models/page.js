module.exports = function(sequelize){
    'use strict';
    var Q = require('q');
    var Sequelize = require("sequelize");

    var Page = sequelize.define('Page', {
        url: Sequelize.STRING,
        name:Sequelize.STRING,
        width:Sequelize.INTEGER,
        height:Sequelize.INTEGER
    });

    return Page;

};