const express = require('express');
const router = express.Router();
const db = require('../db')
//const User = require('./models/user');
var pg = require('pg');
var bcrypt = require('bcrypt');



router.get('/', (req, res) => {
    var payload;
    db.query('SELECT * FROM employee WHERE employee_email = $1', [req.session.username], (err, results) => {
        console.log(req.session.username);
        if (results.rowCount === 0) {
            console.log("rowcount is 0");
            res.status(404).send("User Does Not Exist");
        }
        else {
            payload = results.rows;
            var first_name = results.rows[0].employee_first_name;
            var last_name = results.rows[0].employee_last_name;
            var password = results.rows[0].employee_password;
            //  res.render('user-edit-profile', {message:"We have a user logged in! ", first_name:" " +req.session.username, last_name:"Cicak" });

            res.render('user-edit-profile', { first_name: "" + first_name, last_name: "" + last_name, password: "" + req.session.password });

        }
    });
});

router.post('/', (req, res, next) => {
    var password = req.body.new_password;
    var confirmPassword = req.body.confirm_password;
    var firstName = req.body.first_name;
    var lastName = req.body.last_name;
    var hashPassword;


    if (password !== confirmPassword) {
        //return next(new Error('Passwords do not match'));
        res.render('user-edit-profile', { error_message: "Passwords do not match!" });
        return;
    }

    if (firstName == "") {
        // return next(new Error('First Name is Empty'));
        res.render('user-edit-profile', { error_message: "First Name is Empty!" });
        return;
    }
    if (lastName == "") {
        // return next(new Error('Last Name is Empty'));
        res.render('user-edit-profile', { error_message: "Last Name is Empty!" });
        return;
    }
    //testing
    console.log(req.session.username);
    console.log(req.body.first_name);
    console.log(req.body.last_name);
    console.log(req.body.new_password);
    console.log(req.body.confirm_password);
    console.log(req.session.username);

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            // Store hash in your password DB.
            console.log(hash);
            hashPassword = hash;
            console.log(hashPassword);
            db.query("UPDATE employee SET employee_password = $1,employee_first_name = $2, employee_last_name = $3 WHERE employee_email= $4", [hashPassword, firstName, lastName, req.session.username], (err, results) => {
                if (err) {
                    return console.error('error running query', err);
                }

            });
        });
    });

    res.render('profile-edit', { succesful_message: "You Profile has been Updated Succesfully!" });
});


module.exports = router;



