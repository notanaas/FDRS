const express = require('express');
const Profile = require('../controllers/UserProfileController');
const passport = require('passport');
const router = express.Router();

/* GET users listing. */
router.get('/profile', Profile.profile);

module.exports = router;
