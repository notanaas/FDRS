const express = require('express');
const auth = require("../controllers/AuthController")
const passport = require("passport")
const router = express.Router();

// Register route/middleware
router.post('/register', auth.register);
//login route/middleware
router.post('/login' ,auth.login )
//log out route/middleware
router.post('/logout' , auth.logout)

router.post('/refreshToken' , auth.refresh_token)

// just testing authentication and authorization
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send('You have accessed a protected route!');
  });

module.exports = router;
