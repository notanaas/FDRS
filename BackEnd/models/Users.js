const mongoose = require("mongoose");

const Schema = mongoose.schema

const userSchema = new Schema({
    Username : {type : String , required : true , maxLength : 12},
    Email : {type : String , required : true , maxLength : 256 , minLength : 20},
    Password : {type : String , required : true , maxLength : 256 , minLength : 8},
    isAdmin : {type : Boolean , default : false}
})



module.exports = mongoose.model("User" , userSchema)