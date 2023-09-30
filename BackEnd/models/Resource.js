const mongoose = require("mongoose");

const Schema = mongoose.schema

const resourceSchema = new Schema({
    User : {type: Schema.Types.ObjectId  , ref:"User" , required : true},
    Faculty : {type : Schema.Types.ObjectId , ref:"Faculty" , required:true}, 
    ResourceAuthor : {type:Schema.Types.ObjectId ,ref:"Author", required : true},
    ResourceTitle : {type:String , required : true},
    isAuthorized : {type:Boolean , default:false},
    ResourceType : {type : String},
    Description : {type : String , minLength : 100 , maxLength : 500 , required:true},
    file_path : {type:String ,required:true },
    file_size : {type: Number , required : true , max : 30},
    ResourceCover : {type: String},
    Related_link : {type:String}
})



module.exports = mongoose.model("Resource" , resourceSchema)