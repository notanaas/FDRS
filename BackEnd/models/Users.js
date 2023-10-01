const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const userSchema = new Schema({
    Username : {type : String , required : true , maxLength : 12},
    Email : {type : String , required : true , maxLength : 256 , minLength : 15},
    Password : {type : String , required : true , maxLength : 256 , minLength : 8},
    isAdmin : {type : Boolean , default : false},
    refreshToken : String
});

module.exports = mongoose.model("User" , userSchema);
