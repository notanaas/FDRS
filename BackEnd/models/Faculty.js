const mongoose = require("mongoose");

const Schema = mongoose.schema

const facultySchema  = new Schema({
    FacultyName :{type : String , required:true}
})

facultySchema.virtual("url").get(function(){

    return `/Faculty/${this._id}`
})

module.exports = mongoose.model("Faculty" , facultySchema)