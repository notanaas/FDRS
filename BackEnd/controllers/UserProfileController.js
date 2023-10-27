const Users = require("../models/Users")
const UserFavs = require('../models/UserFavRes')
const asyncHandler = require("express-async-handler")


exports.profile = asyncHandler(async(req,res,next)=>
{
    const [profile,resource] = await Promise.all([
        Users.find(req.user._id).exec(),
        UserFavs.findById(req.user._id).populate("Resource").exec()
    ])
    if(!profile)
    {
        return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({profile:profile , userfavorites : UserFavs})

})