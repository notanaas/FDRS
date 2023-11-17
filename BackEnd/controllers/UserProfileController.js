const Users = require("../models/Users")
const UserFavs = require('../models/UserFavRes')
const Resource = require('../models/Resources')
const asyncHandler = require("express-async-handler")


exports.profile = asyncHandler(async (req, res, next) => {
    
      const profile = await Users.findById(req.user._id).exec();
      const resource = await Resource.findById(req.user._id).exec();
      const favorites = await UserFavs.findById(req.user._id).exec();
      const ProfileData = {
        profile: profile,
        UserResources: resource ? resource : { message: 'uploaded resources not found' },
        userFavorites: favorites ? favorites : { message: 'Favorites not found' }
      };    
  
      return res.status(200).json(ProfileData);
    
  });
  
exports.resource_authorize = asyncHandler(async(req,res,next)=>
{
    const resource = await Resource.find({isAuthorized:false}).exec()
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
