const mongoose = require("mongoose");

const Schema = mongoose.schema

const userfavresSchema  = new Schema({
    User : {type: Schema.Types.ObjectId  , ref:"User" , required : true},
    Resource : {type:Schema.Types.ObjectId , ref:"Resource" , required:true}
})

userfavresSchema.virtual("url").get(function(){

    return `/profile/userfav/${this._id}`
})

module.exports = mongoose.model("UserFavRes" , userfavresSchema)