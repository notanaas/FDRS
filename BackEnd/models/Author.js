const mongoose = require("mongoose");

const Schema = mongoose.schema

const authorSchema = new Schema({
    first_name : {type: String , required : true , maxLength : 100 },
    family_name:  {type: String , required : true , maxLength : 100} , 
})

authorSchema.virtual("name").get(function(){
    if(this.first_name && this.family_name )
    {
      fullname = `${this.first_name} ${this.family_name}`
    }
    return fullname
  })