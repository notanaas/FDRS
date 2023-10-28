const asyncHandler = require("express-async-handler");
const FeedBack = require("../models/FeedBack");

exports.feedback = asyncHandler(async(req,res,next)=>
{
    const searchTerm = req.query.term;
    
    const newFeed = FeedBack({
        User : req.user._id,
        SearchText : searchTerm
    })
    await newFeed.save()

    return res.status(201).json({message:"Thank you for you're feedback"})

})