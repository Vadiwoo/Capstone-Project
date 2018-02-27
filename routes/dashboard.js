const express = require('express');
const router = express.Router();
const db = require('../db')
const { Client } = require('pg');


router.get('/', (req, res) => {
    

    //connecting to database
    var username = req.session.username;
    
    var context = {};


    db.query('SELECT * FROM employee WHERE employee_email = $1',[username], (err, results) => {
	  
        if (err) {
            return console.error('error running query', err);
        }

      
        console.log(results);
        console.log(results.rows);
        var employee_first_name;
        var employee_type;
      
        context = {
     
            "employee_first_name":results.rows[0].employee_first_name,
            "employee_type" :results.rows[0].employee_type,
           
        };
            
        if (results.rows[0].employee_type === "user")
        {
            console.log("this is user");
            res.setHeader('Content-Type', 'text/html');
	      
            res.render('dashboard',context);
        }

            //logged in as admin
        else if (results.rows[0].employee_type === "admin")
        {
            console.log("this is admin");
            res.setHeader('Content-Type', 'text/html');
            res.render('admin_main',context );
        }
    });
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