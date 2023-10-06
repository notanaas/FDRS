const express = require('express');
const Resource = require("../controllers/ResourceController")
const passport = require("passport")
const router = express.Router();

//Get all resource for resource page
router.get('/resources/:facultyName', Resource.resource_list);
router.get('/download/:fileId' , Resource.download_pdf)
router.post('/resources/create' ,passport.authenticate('jwt', { session: false }),Resource.Resource_create_post)
module.exports = router;
