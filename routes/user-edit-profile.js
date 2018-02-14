const express = require('express');
const router = express.Router();
const db = require('../db')
//const User = require('./models/user');
const { Client } = require('pg');



router.get('/', (req, res) => {
    var payload;
    db.query('SELECT * FROM employee WHERE employee_email = $1',[req.session.username], (err, results) => {
        console.log(req.session.username);
        if(results.rowCount === 0) {
            console.log("rowcount is 0");
            res.status(404).send("User Does Not Exist");
        }
        else {
            payload = results.rows;
            var first_name = results.rows[0].employee_first_name;
            var last_name = results.rows[0].employee_last_name;
            var password = results.rows[0].employee_password;
          //  res.render('user-edit-profile', {message:"We have a user logged in! ", first_name:" " +req.session.username, last_name:"Cicak" });

            res.render('user-edit-profile', {first_name:" " +first_name, last_name:" " +last_name, password:" "+password });

        }
    });
});
    
      
      
    


module.exports = router;



