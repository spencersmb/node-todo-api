const mongoose = require('mongoose')
const validator = require('validator')


const User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        minlength: 2,
        trim: true,
        unique: true, // make sure no other email is in use

        //cusotm email validation - mongoose custom validation -search google
        // also using npm validator
        // validator runs automatically when saving
        validate: {
            isAsync: true,
            // validator: (value) => {
            //     return validator.isEmail(value)
            // },
            validator: validator.isEmail, // this is the same as above - auto pass value
            message: '{VALUE} is not a valid email'
        }
            
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        isAsync: true
    },
    //tokens array is only available in mongoDB
    tokens: [
        {
            access:{
                type: String,
                required: true
            },
            token: {
                type: String,
                required:true
            }
        }
    ]
});

module.exports = {User};