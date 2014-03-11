module.exports = function(ORM){
    'use strict';

    return {
        name:'Page',
        schema:{
            url: {
                type:ORM.STRING,
                validate:{
                    notEmpty:true,
                    notNull:true
                }
            },
            name:{
                type:ORM.STRING,
                validate:{
                    notEmpty:true,
                    notNull:true
                }
            }
        },
        options:{

        },
        relationships:{
            hasMany:"Snapshot"
        }
    };

};