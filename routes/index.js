const express = require('express');
const router = express.Router();

//const secured = require('../middleware/secured');


/* GET home page. */
/*
router.get('/',function(req,res){
  res.render('index') 
  });
  
router.get('/sign-in',function(req,res){
  res.render('sign-in') 
  });
  */
router.get('/', (req, res) => {
    
    const { user } = req;

    if (user) {
        return res.redirect('/dashboard');
    }
     
    res.render('index');
});

/*
router.get('/dashboard', secured, (req, res) => {
    const { user } = req;

    if (user.role === Role.ORGANIZATION && !user.organizationId) {
        return res.redirect('/organizations/new');
    } else if (user.role === Role.FAMILY && !user.profileId) {
        return res.redirect('/profiles/new');
    }

    res.render('dashboard', {
       user
    });
});
  */

router.get('/create-awards', (req, res) => {
    res.render('create-awards');
}); 
  module.exports = router;
