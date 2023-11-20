const express = require('express');
const Comment = require('../controllers/CommentController');
const passport = require('passport');
const router = express.Router();

// Create a comment on a specific resource within a faculty
router.post('/comments', passport.authenticate('jwt', { session: false }), Comment.comment);
router.delete('/delete/:id' , passport.authenticate('jwt', { session: false }) , Comment.Delete_comment)
router.put('/update/:id' , passport.authenticate('jwt', { session: false }) , Comment.Update_Comment)

module.exports = router;
