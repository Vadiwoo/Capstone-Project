const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('dashboard');
});

router.get('/user-edit-profile', (req, res) => {
   res.render('user-edit-profile');
});

router.get('/user-delete-award', (req, res) => {
    res.render('user-delete-award');
});

router.get('/create-awards', (req, res) => {
    res.render('create-awards');
});





module.exports = router;