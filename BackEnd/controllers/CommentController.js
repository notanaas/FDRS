const Comment = require('../models/Comment');

exports.comment = async (req, res, next) => {
  const { text } = req.body;
  const resourceId = req.params.resourceId; // Retrieve resourceId from route parameters

  try {
    // Create a new comment and save it to the database, associating it with the specified resource
    const newComment = new Comment({
      Comment: text,
      Resource: resourceId,
      user: req.user._id, // Assuming you have user information available in the request.
    });
    await newComment.save();

    // Return a success response
    return res.status(201).json({ message: 'Comment created successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while creating the comment' });
  }
};