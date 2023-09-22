<<<<<<< HEAD
var express = require('express');
var router = express.Router();
=======
const express = require('express');
const router = express.Router();
>>>>>>> 80ded76f1f74d87ad6a5d89d38722ad0fbcfdb0d

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
