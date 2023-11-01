const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const Users = require("../models/Users")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator"); // validator and sanitizer
const crypto = require('crypto');  // for refreshTokens
const nodemailer = require('nodemailer');
exports.register = [
    body('username' , "Username Must be required")
    .trim()
    .isLength({min:1})
    .escape()
    .custom(async (Username)=>
        {
         try {
            const usernameExists  = await Users.findOne({Username:Username})
            if(usernameExists)
            {
                throw new Error('Username already exists')
            }
         } catch (error) {
            throw new Error(error)
         }
        }),
    body("email" , "Email must be required")
    .trim()
    .isLength({min:1})
    .escape()
    .custom(async (Email)=>
    {
        try {
            const emailExists = await Users.findOne({Email : Email})
            if(emailExists)
            {
                throw new Error('Email already exists')
            }
        } catch (error) {
            throw new Error(error)
        }
    }),
    body("password" , "password must be 8 characters long").trim().isLength({min:8}),
    asyncHandler (async(req,res,next)=>
{
    const errors = validationResult(req)

    if(!errors.isEmpty())
    {
        return res.status(403).json(
            {
                username : req.body.username,
                errors : errors.array()
            })
    }
    bcrypt.hash(req.body.password , 10 , async (err,hashedPassword)=>
    {
        if(err)
        {
            return next(err)
        }
        const user = new Users({
            Username:req.body.username,
            Email:req.body.email,
            Password : hashedPassword,
            isAdmin:false
        })
        await user.save()
        res.status(200).json({
            message:"User Created Successfuly."
        })
    })

})
]

exports.login = asyncHandler(async (req, res, next) => {
    const user = await Users.findOne({
      $or: [
        { Username: req.body.username },
        { Email: req.body.email }
      ]
    });
  
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
  
    const passwordMatch = await bcrypt.compare(req.body.password, user.Password);
  
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    const refreshToken = crypto.randomBytes(40).toString('hex');
    process.env.REFRESH_TOKEN_SECRET = refreshToken;
    // Store the refresh token in the user's record
    user.refreshToken = refreshToken;
    await user.save();
  
    const body = {
      _id: user._id,
      username: user.Username,
      email: user.Email 
    };
  
    const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
        expiresIn: "1d" // 1 minute expiration
    });
  
    // Now, you can send the token in the response
    return res.json({message:"Logged in successfuly",token , refreshToken});
  });
  
exports.logout = asyncHandler(async(req,res,next)=>
{
const { refreshToken } = req.body;
  const user = Users.find((u) => u.refreshToken === refreshToken);

  if (!user) {
    return res.status(400).json({ message: 'Invalid refresh token' });
  }

  // Clear the refreshToken (set it to null)
  user.refreshToken = null;

  res.json({ message: 'User logged out successfully' });

})

exports.refresh_token = async(req,res)=>
{
    const { refreshToken } = req.body;
    
    try {
        const decoded = jwt.verify(refreshToken ,process.env.REFRESH_TOKEN_SECRET)

    // Find the user associated with the refresh token
    const user = await Users.findById(decoded._id)

    if(!user || user.refreshToken !== refreshToken)
    {
        return res.status(401).json({ message: 'Invalid refresh token' });
    }
     // Generate a new access token
     const accessToken = jwt.sign({ user: { _id: user._id, username: user.Username, email: user.Email } }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Set the expiration time for the new access token
      });
    } catch (error) {
           
    }
}

exports.forgot_password  = [
    body("email" , "Email must be required")
    .trim()
    .isLength({min:1})
    .escape()
    .custom(async (Email)=>
    {
        try {
            const emailExists = await Users.findOne({Email : Email})
            if(!emailExists)
            {
                throw new Error('Email does not exists')
            }
        } catch (error) {
            throw new Error(error)
        }
    }),
    asyncHandler(async(req,res,next)=>{
        const emailExists = await Users.findOne({Email : req.body.Email})
        const secret = process.env.JWT_SECRET + emailExists.Password
        const payload = {
            email :  emailExists.Email,
            id:emailExists._id
        }
        const token  = jwt.sign(payload,secret,{expiresIn :"20m"})
        const link = `http://localhost:3000/reset-password/${emailExists._id}/${token}`
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'wfarid31@gmail.com',
              pass: 'yourpassword'
            }
          });
          
          const mailOptions = {
            from: 'wfarid31@gmail.com',
            to: 'wfarid31@gmail.com',  // emailExists
            subject: 'Reset password link',
            text: link
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        return res.status(200).json({message:"password reset link has been sent to you're email... "})
    })
]   

exports.get_reset_password = asyncHandler(async(req,res,next)=>
{
    const {id,token} = req.params
    console.log(req.params)
    const userExists = await Users.findOne({_id : id})
            if(!userExists)
            {
               return res.json({message:"User does not exist"})
            }
    const secret = process.env.JWT_SECRET + userExists._id
    try {
        const verify = jwt.verify(token,secret)
        return res.json({email:verify.email})
    } catch (error) {
        return res.json({message:"Not verified"})
    }
})
exports.post_reset_password =[
    body("password" , "password must be 8 characters long").trim().isLength({min:8}),
    asyncHandler(async(req,res,next)=> 
{
    const {id,token} = req.params
    const {password} = req.body
    console.log(req.params)
    const userExists = await Users.findOne({_id : id})
            if(!userExists)
            {
               return res.json({message:"User does not exist"})
            }
    const secret = process.env.JWT_SECRET + userExists._id
    try {
        const verify = jwt.verify(token,secret)
        const encryptedPassword = await bcrypt.hash(password , 10)
        await Users.updateOne({
            _id :id
        },{
            $set:{
                Password : encryptedPassword
            }
        })
        return res.status(201).json({message:"password updated"})
    } catch (error) {
        return res.json({message:"something went wrong"})
    }
})]