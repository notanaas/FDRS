const mongoose = require("mongoose");

const Schema = mongoose.schema

const feedbackShema = mongoose.schema({
    User : {type: Schema.Types.ObjectId  , ref:"User" , required : true},
    SearchText : {type : String , required : true , minLength : 10 , maxLength : 50},
    isFound : {type : Boolean , default:false}
})

module.exports = mongoose.model("FeedBack" , feedbackShema)