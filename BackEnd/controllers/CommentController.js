const Comment = require('../models/Comment');
const { body, validationResult } = require("express-validator"); // validator and sanitizer
const asyncHandler = require("express-async-handler")
exports.comment =[
  body("comment" , "Required text to post").trim().isLength({min:1}).escape(),


  asyncHandler(async (req, res, next) => {
  const errors = validationResult(req)
  const { text } = req.body;
  const resourceId = req.params.resourceId; // Retrieve resourceId from route parameters
  
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
    user: req.user._id, // Assuming you have user information available in the request.
    });
    await newComment.save();

    // Return a success response
    return res.status(201).json({ message: 'Comment created successfully' });
})];