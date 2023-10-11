// Backend: server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Users = require('./models/Users');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3007;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB (you should replace the connection string with your MongoDB URI)
mongoose.connect('mongodb://localhost:27017/your_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Define JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register route
app.post(
  '/api/register',
  [
    body('username', 'Username Must be required')
      .trim()
      .isLength({ min: 1 })
      .escape()
      .custom(async (Username) => {
        try {
          const usernameExists = await Users.findOne({ Username: Username });
          if (usernameExists) {
            throw new Error('Username already exists');
          }
        } catch (error) {
          throw new Error(error);
        }
      }),
    body('email', 'Email must be required')
      .trim()
      .isLength({ min: 1 })
      .escape()
      .custom(async (Email) => {
        try {
          const emailExists = await Users.findOne({ Email: Email });
          if (emailExists) {
            throw new Error('Email already exists');
          }
        } catch (error) {
          throw new Error(error);
        }
      }),
    body('password', 'Password must be 8 characters long')
      .trim()
      .isLength({ min: 8 }),
    body('confirmationPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  ],
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(403).json({
        username: req.body.username,
        errors: errors.array(),
      });
    }
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      const user = new Users({
        Username: req.body.username,
        Email: req.body.email,
        Password: hashedPassword,
        isAdmin: false,
      });
      await user.save();
      res.status(200).json({
        message: 'User Created Successfully.',
      });
    });
  })
);

// Login route
app.post('/api/login', asyncHandler(async (req, res, next) => {
  const user = await Users.findOne({
    $or: [
      { Username: req.body.username },
      { Email: req.body.email },
    ],
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  const passwordMatch = await bcrypt.compare(req.body.password, user.Password);

  if (!passwordMatch) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  const refreshToken = crypto.randomBytes(40).toString('hex');
  process.env.REFRESH_TOKEN_SECRET = refreshToken;
  // Store the refresh token in the user's record
  user.refreshToken = refreshToken;
  await user.save();

  const body = {
    _id: user._id,
    username: user.Username,
    email: user.Email,
  };

  const token = jwt.sign({ user: body }, JWT_SECRET, {
    expiresIn: '1d',
  });

  return res.json({ message: 'Logged in successfully', token, refreshToken });
}));

// Logout route
app.post('/api/logout', asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;
  const user = Users.find((u) => u.refreshToken === refreshToken);

  if (!user) {
    return res.status(400).json({ message: 'Invalid refresh token' });
  }

  // Clear the refreshToken (set it to null)
  user.refreshToken = null;
  await user.save();

  res.json({ message: 'User logged out successfully' });
}));

// Refresh token route
app.post('/api/refresh_token', async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find the user associated with the refresh token
    const user = await Users.findById(decoded._id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Generate a new access token
    const accessToken = jwt.sign(
      { user: { _id: user._id, username: user.Username, email: user.Email } },
      JWT_SECRET,
      {
        expiresIn: '1d',
      }
    );

    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
