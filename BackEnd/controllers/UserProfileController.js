const Users = require("../models/Users")
const UserFavs = require('../models/UserFavRes')
const Resource = require('../models/Resources')
const asyncHandler = require("express-async-handler")
const fs = require("fs")


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
        const resource = await Resource.findByIdAndUpdate(req.params.id, { isAuthorized: flag }, { new: true }).exec();
        res.status(200).json({ accepted:"resource accepeted" , data: resource });

    }
    const uploadDir = path.join(__dirname, '..', 'uploads'); // Adjust the path as necessary
    const resource = await Resource.findByIdAndDelete(req.params.id).exec()
    fs.unlink(`${uploadDir}/${resource.file_path}`,(err)=>{
        if(err)
        {
            res.status(404).json({message:"file not found"})
        }
    })
    fs.unlink(`${uploadDir}/${resource.file_path}`,(err)=>{
        if(err)
        {
            res.status(404).json({message:"file not found"})
        }
    })
    res.status(200).json({declined:"resource declined"})
})