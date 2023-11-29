const Comment = require('../models/Comment');
const Resource = require("../models/Resources")
const { body, validationResult } = require("express-validator"); // validator and sanitizer
const asyncHandler = require("express-async-handler")
exports.comment =[
  body("text" , "Required text to post").trim().isLength({min:1}).escape(),
  asyncHandler(async (req, res, next) => {
  const errors = validationResult(req)
  const  {text}  = req.body;
  const resourceId = req.params.id; // Retrieve resourceId from route parameters
  
  if(!errors.isEmpty())
  {
      return res.status(403).json(
          {
              errors : errors.array()
          })
  }
    // Create a new comment and save it to the database, associating it with the specified resource
    const newComment = new Comment({
    Comment: text,
    Resource: resourceId,
    User: req.user._id, // Assuming you have user information available in the request.
    });
    await newComment.save();

    // Return a success response
    return res.status(201).json({ message: 'Comment created successfully' });
})];

exports.Delete_comment = asyncHandler(async(req,res,next)=>
{
    const resourceId = req.params.id; // finding the comment by the resource id
    const comment = await Comment.findOne({Resource:resourceId}).exec();

    if (!comment) {
      return res.status(404).json({ message: "Resource does not exist" });
    }

    // Check if the user is an admin or if the resource belongs to the user
    if (req.user.isAdmin || comment.User._id.toString() === req.user._id.toString()) {
      await Comment.findByIdAndDelete(comment._id);
      return res.status(200).json({ message: "Comment deleted successfully" });
    }
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
})
exports.Update_Comment =[
    body("NewComment" , "Required text to post").trim().isLength({min:1}).escape(),
    asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)
    const resourceId = req.params.id;    // finding the comment by the resource id
    const comment = await Comment.findOne({Resource : resourceId}).exec()
    if(comment.User._id.toString() === req.user._id.toString())
    {
        //if user then delete
        await Comment.findByIdAndUpdate(comment._id).exec()
        return res.status(200).json({ message: "Comment Updated successfully" });
    }
    // Return a success response
    return res.status(403).json({ message: "Unauthorized to Update this Comment" });
  })];