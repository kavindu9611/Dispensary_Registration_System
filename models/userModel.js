const mongoose = require("mongoose");
//const Mail = require("nodemailer/lib/mailer");

const userSchema = new mongoose.Schema({

    fname : {
        type:String,
        required : true
    },
    lname : {
        type:String,
        required : true
    },
    email : {
        type:String,
        required : true
    },
    mobile : {
        type:String,
        required : true
    },
    image : {
        type:String,
        required : true
    },
    password : {
        type:String,
        required : true
    },
    
    is_varified : {
        type:Number,
        default:0
    }

});

module.exports = mongoose.model('User',userSchema);