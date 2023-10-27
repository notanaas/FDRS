const express = require('express');
const Profile = require('../controllers/UserProfileController');
const passport = require('passport');
const router = express.Router();

/* GET users listing. */
router.get('/profile',passport.authenticate('jwt', { session: false }), Profile.profile);

module.exports = router;
