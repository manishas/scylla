module.exports = function(ORM){
    'use strict';

    return {
        name:'Snapshot',
        schema:{
            params: ORM.STRING,
            notes:ORM.STRING,
            state:ORM.STRING
        },
        options:{},
        relationships:{}
    };

};