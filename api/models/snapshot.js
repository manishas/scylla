module.exports = function(ORM){
    'use strict';

    return {
        name:'Snapshot',
        schema:{
            params: ORM.TEXT,
            notes:ORM.TEXT,
            console:ORM.TEXT,
            /**
             * Queued, Capturing, Complete
             */
            state:{
                type:ORM.STRING,
                validate:{
                    isIn:[['Queued', 'Capturing', 'Complete']]
                }
            }
        },
        options:{},
        relationships:{
            belongsTo:"Page",
            hasOne:"Image"
        }
    };

};