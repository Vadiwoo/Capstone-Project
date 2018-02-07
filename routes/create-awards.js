const express = require('express');
const router = express.Router();
const { Client } = require('pg');


router.get('/', (req, res) => {
        res.render('create-awards');
    });  

router.post('/', (req, res) => {
    res.render('send-award');
});  
	     
    
module.exports = router;