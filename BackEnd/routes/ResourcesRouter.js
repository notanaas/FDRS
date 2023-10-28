const express = require("express")
const Resource = require("../controllers/ResourcesController")
const passport = require("passport")
const router = express.Router()

//upload a resource
router.post('/create/:id' ,passport.authenticate('jwt', { session: false }),Resource.Resource_create_post)


module.exports = router;