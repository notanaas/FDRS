const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const Users = require("../models/Users")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator"); // validator and sanitizer
const crypto = require('crypto');  // for refreshTokens
const nodemailer = require('nodemailer');
const path = require('path');

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
    return res.json({message:"Logged in successfully", token, refreshToken, user:user });
  });
  
exports.logout = asyncHandler(async(req,res,next)=>
{
const { refreshToken } = req.body;
const user = await Users.findOne({ refreshToken: refreshToken }).exec();


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

exports.forgot_password = [
    body('email', 'Email must be required')
      .trim()
      .isLength({ min: 1 })
      .escape()
      .custom(async (email, { req }) => {
        try {
          const emailExists = await Users.findOne({ Email: email });
          if (!emailExists) {
            throw new Error('Email does not exist');
          }
        } catch (error) {
          throw new Error(error.message);
        }
      }),
      asyncHandler(async (req, res, next) => {
        const emailExists = await Users.findOne({ Email: req.body.email });
        console.log(req.body);
        
        if (!emailExists) {
          // Handle the case where the email doesn't exist
          return res.status(404).json({ message: 'Email not found' });
        }
  
        const secret = process.env.JWT_SECRET + emailExists._id;

  
        const payload = {
          email: emailExists.Email,
          id: emailExists._id
        };
        const token = jwt.sign(payload, secret, { expiresIn: '20m' });
        const link = `http://localhost:3000/reset-password/${emailExists._id}/${token}`;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'FDRS1697@gmail.com',
              pass: process.env.pass   
            }
          });
          
          const logoPath = path.join('/Users/anasalsayed/Documents/Anas Alsayed/UNIVERSTY/9TH/FDRS/BackEnd/LOGO', 'anas logo red png.png');

const mailOptions = {
    from: 'FDRS1697@gmail.com',
    to: emailExists.Email,  // emailExists
    subject: 'Reset password link',
    attachments: [{
        filename: 'logo.png',
        path: logoPath,
        cid: 'logo'
    }],
    html: `
        <h1>Password Reset</h1>
        <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click on the following link, or paste this into your browser to complete the process:</p>
        <a href="${link}" target="_blank">Reset Password</a>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <div style="text-align: center; margin-top: 30px;">
            <img src="cid:logo" alt="Your Logo" style="max-width: 200px;">
        </div>
    `
};
          
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              // Handle the error when sending the email fails
              console.error(error); // Log the error for debugging
              return res.status(500).json({ message: "Email sending failed. Please try again later." });
            } else {
              // Email was sent successfully
              console.log('Email sent: ' + info.response);
              return res.status(200).json({ message: "Password reset link has been sent to your email." });
            }
          });
          
      })
  ];
     
 

exports.post_reset_password =[
    body("password" , "password must be 8 characters long").trim().isLength({min:8}),
    asyncHandler(async (req, res, next) => {
      const { id, token } = req.params;
      const { password } = req.body;

      // Find the user by their ID
      const userExists = await Users.findById(id);
      if (!userExists) {
          return res.status(404).json({ message: "User does not exist" });
      }

      // Verify the token
      const secret = process.env.JWT_SECRET + userExists._id;
      try {
        jwt.verify(token, secret);
    
        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Update the user's password
        const updatedUser = await Users.findByIdAndUpdate(id, { $set: { Password: hashedPassword } }, { new: true });
        await updatedUser.save();
        console.log(updatedUser);
        if (updatedUser) {
            return res.status(201).json({ message: "Password updated successfully" });
        } else {
            return res.status(400).json({ message: "Password could not be updated" });
        }
    } catch (error) {
      console.error("Error during password reset:", error);
      return res.status(500).json({ message: "Error during password reset", error: error.message });
  }
  })
];