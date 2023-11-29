const Users = require("../models/Users")
const UserFavs = require('../models/UserFavRes')
const Resource = require('../models/Resources')
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator"); // validator and sanitizer
const fsPromises = require("fs").promises
const path = require("path");



exports.profile = asyncHandler(async (req, res, next) => {
    try {
      const user = await Users.findById(req.user._id);
      const resources = await Resource.find({ User: req.user._id }); // Assuming 'User' is the referencing field in the Resource schema
      const favorites = await UserFavs.find({ User: req.user._id }); // Assuming 'User' is the referencing field in the UserFavs schema
  
      const profileData = {
        profile: user,
        UserResources: resources,
        userFavorites: favorites
      };
  
      res.status(200).json(profileData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  
exports.resource_authorize = asyncHandler(async(req,res,next)=>
{
    const resource = await Resource.find({isAuthorized:false}).populate("Faculty").populate("User").exec()
    if(!resource)
    {
        return res.status(404).json({message:"no resources available"})
    }
    return res.status(200).json({resource:resource})
})


exports.admin_acceptance = asyncHandler(async (req, res, next) => {
    try {
        let flag = false;
        const btnAccept = req.body.accept;

        if (flag !== btnAccept) {
            flag = true;
            const resource = await Resource.findByIdAndUpdate(req.params.id, { isAuthorized: flag }, { new: true }).exec();
            return res.status(200).json({ accepted: "resource accepted", data: resource });
        }

        const resource = await Resource.findByIdAndDelete(req.params.id).exec();

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }
        console.log(resource.file_path)
        await fsPromises.unlink(resource.file_path);
        console.log(resource.Cover)
        // Assuming resource.Cover contains the full path
        await fsPromises.unlink(resource.Cover);

        res.status(200).json({ declined: "resource declined" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


exports.updateProfile = [
    body('newUsername', 'New Username must be required')
        .trim()
        .optional()
        .isLength({ min: 1 })
        .escape(),
    body('newEmail', 'New Email must be required')
        .trim()
        .optional()
        .isLength({ min: 1 })
        .escape()
        .isEmail(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(403).json({
                errors: errors.array()
            });
        }

            const user = await Users.findById(req.user._id).exec(); // Assuming you have the user ID available in the request

            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            // If the new username is provided and different, check if it already exists
            if (req.body.newUsername && req.body.newUsername !== user.Username) {
                const usernameExists = await Users.findOne({ Username: req.body.newUsername });
                if (usernameExists && usernameExists._id.toString() !== req.user._id.toString()) {
                    throw new Error('Username already exists');
                }
                user.Username = req.body.newUsername;
            }

            // If the new email is provided and different, check if it already exists
            if (req.body.newEmail && req.body.newEmail !== user.Email) {
                const emailExists = await Users.findOne({ Email: req.body.newEmail });
                if (emailExists && emailExists._id.toString() !== req.user._id.toString()) {
                    throw new Error('Email already exists');
                }
                user.Email = req.body.newEmail;
            }

            await user.save();

            res.status(200).json({
                message: 'User profile updated successfully.'
            });

    })
];


