const mongoose = require("mongoose");

const Schema = mongoose.schema

const facultySchema  = new Schema({
    FacultyName :{type : String , required:true}
})

facultySchema.virtual("url").get(function(){

    return `/profile/${this._id}`
})

module.exports = mongoose.model("Faculty" , facultySchema)