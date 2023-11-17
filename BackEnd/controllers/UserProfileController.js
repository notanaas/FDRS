const Users = require("../models/Users")
const UserFavs = require('../models/UserFavRes')
const Resource = require('../models/Resources')
const asyncHandler = require("express-async-handler")


exports.profile = asyncHandler(async(req,res,next)=>
{
    const [profile,resource,favorites] = await Promise.all([
        Users.findById(req.user._id).exec(),
        Resource.findById(req.user._id).exec(),
        UserFavs.findById(req.user._id).populate("Resource").exec(),
    ])
    if(!profile)
    {
        return res.status(404).json({ message: 'User not found' });
    }
    if(!resource)
    {
        res.status(404).json({message:"No uploaded resources for this user!"})
    }
    if(!favorites)
    {
        res.status(404).json({message:"No favorites resources for this user!"})
    }
    return res.status(200).json({profile:profile ,UserResources:resource, userfavorites : favorites})

})
exports.resource_authorize = asyncHandler(async(req,res,next)=>
{
    const resource = await Resrouce.find({isAuthorized:false}).exec()
    if(!resource)
    {
        return res.status(404).json({message:"no resources available"})
    }
    return res.status(200).json({resource:resource})
})
exports.admin_acceptance = asyncHandler(async (req, res, next) => {
    let flag = false;
    const btnAccept = req.body.accept;

    if (flag !== btnAccept) {
        flag = true;
    }

    // Use await to wait for the update operation to complete
    const resource = await Resource.findByIdAndUpdate(req.params.id, { isAuthorized: flag }, { new: true }).exec();

    // Additional code if needed

    // Send a response or do something else
    res.status(200).json({ success: true, data: resource });
});
