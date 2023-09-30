const express = require('express');
const auth = require("../controllers/AuthController")
const router = express.Router();

// Register Get Method
router.post('api/register', auth.register);

//login method
router.get('api/login' ,auth.login )


module.exports = router;
