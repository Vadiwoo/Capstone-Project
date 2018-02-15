const express = require('express');
const router = express.Router();
var expressSession = require('express-session');

router.get('/', (req, res) => {
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

module.exports = router;