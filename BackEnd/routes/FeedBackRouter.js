const express = require('express');
const FeedBack = require('../controllers/FeedbackController');
const passport = require('passport');
const router = express.Router();

router.post("/FeedBack-post" , passport.authenticate('jwt', { session: false }) ,FeedBack.feedback)