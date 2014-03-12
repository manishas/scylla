module.exports = function(ORM){
    'use strict';

    return {
        name:'Suite',
        schema:{
            name:{
                type:ORM.STRING,
                validate:{
                    notEmpty:true,
                    notNull:true
                }
            },
            scheduleEnabled:{
                type:ORM.BOOLEAN,
                defaultValue:false
            },
            schedule:{
                type:ORM.TEXT
            }
        },
        options:{},
        relationships:{
            hasMany:["User", "watchers"],
            belongsTo:["User", "creator"]
        }
    };

};