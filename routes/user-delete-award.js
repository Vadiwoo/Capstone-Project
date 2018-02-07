const express = require('express');
const router = express.Router();
const { Client } = require('pg');


router.get('/', (req, res) => {
    res.render('user-delete-award');
});  






module.exports = router;