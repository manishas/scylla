module.exports = function(ORM){
    'use strict';

    return {
        name:'Snapshot',
        schema:{
            params: ORM.STRING,
            notes:ORM.STRING,
            state:ORM.STRING,
            imageId:ORM.STRING,
            thumbId:ORM.STRING
        },
        options:{},
        relationships:{
            belongsTo:"Page"
        }
    };

};