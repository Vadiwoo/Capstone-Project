const express = require('express');
const router = express.Router();

const db = require('../db');

router.get('/', function(req, res) {
  res.render('admin_main');
});

module.exports = router;
