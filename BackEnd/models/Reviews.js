const mongoose = require("mongoose");

const Schema = mongoose.schema

const reviewsSchema = new Schema({
    User : {type: Schema.Types.ObjectId  , ref:"User" , required : true},
    Resource : {type:Schema.Types.ObjectId , ref:"Resource" , required:true},
    Comment : {type:String , required:true , minLength : 3 , maxLength : 100}
})

module.exports = mongoose.model("Review" , reviewsSchema)