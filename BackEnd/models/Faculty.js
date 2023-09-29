const mongoose = require("mongoose");

const Schema = mongoose.schema

const facultySchema  = new Schema({
    FacultyName :{type : String , required:true}
})



module.exports = mongoose.model("Faculty" , facultySchema)