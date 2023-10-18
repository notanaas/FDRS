const mongoose = require("mongoose");

const Schema = mongoose.Schema

const authorSchema = new Schema({
    first_name : {type: String , required : true , maxLength : 100 },
    last_name:  {type: String , required : true , maxLength : 100} , 
})

authorSchema.virtual("name").get(function(){
    if(this.first_name && this.last_name )
    {
      fullname = `${this.first_name} ${this.last_name}`
    }
    return fullname
  })
  module.exports = mongoose.model("Author" , authorSchema)