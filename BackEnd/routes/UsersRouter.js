const express = require('express');
const Profile = require('../controllers/UserProfileController');
const passport = require('passport');
const router = express.Router();

const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        return next();
    }
    return res.status(403).json({ message: "Not authorized. Admin access required." });
};

/* GET users listing. */
router.get('/profile',passport.authenticate('jwt', { session: false }), Profile.profile);

// Your existing resource_authorize route
app.get("/resource/authorize", passport.authenticate('jwt', { session: false }), isAdmin, resource_authorize);

// Your existing admin_acceptance route
app.post("/admin/acceptance/:id", passport.authenticate('jwt', { session: false }), isAdmin, admin_acceptance);
module.exports = router;
