const Users = require("../models/Users")
const asyncHandler = require("express-async-handler")


exports.profile = asyncHandler(async(req,res,next)=>
{
    const profile = await Users.findById(req.params.id)
    if(!profile)
    {
        return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({profile:profile})

})