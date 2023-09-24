const mongoose = require("mongoose");

const Schema = mongoose.schema

const authorSchema = new Schema({
    first_name : {type: String , required : true , maxLength : 100 },
    family_name:  {type: String , required : true , maxLength : 100} , 
})

/*authorSchema.virtual("url").get(function(){
    // We don't use an arrow function as we'll need the this object
    return `/author/${this._id}`
})*/