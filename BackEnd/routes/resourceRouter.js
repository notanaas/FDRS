const express = require('express');
const Resource = require("../controllers/ResourceController")
const passport = require("passport")
const router = express.Router();


//upload a resource
router.post('/resource/create' ,passport.authenticate('jwt', { session: false }),Resource.Resource_create_post
)//Get all resource for resource page
router.get('/resources/:FacultyName', Resource.resource_list);
//get resource details
router.get('/resource/:id' , Resource.Resource_detail)
//download a resource
router.get('/download/:fileId' , Resource.pdf_download)
//get a search
router.get('/resource/search' , Resource.search_resource)

module.exports = router;
