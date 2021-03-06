﻿const express = require('express');
const router = express.Router();
const db = require('../db')
const nodemailer = require('nodemailer');
const expressSession = require('express-session');
var bcrypt = require('bcrypt');

var pg = require('pg');


router.get('/', (req, res) => {
    res.render('sign-in');
});


router.get('/password', (req, res) => {

    res.render('password-recovery');
});


router.post('/password', (req, res) => {
    var recipient = req.body.email;
    var payload;
    var hashPassword;

    db.query('SELECT * FROM employee WHERE employee_email = $1', [recipient], (err, results) => {

        if (results.rowCount === 0) {
            console.log("rowcount is 0");
            res.status(404).send("User Does Not Exist");
        }

        else {
            payload = results.rows;
            var firstName = results.rows[0].employee_first_name;
        }

    });
    //*********************Creating random string as a temp Password********************************
    var tempPassword = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 6; i++)
        tempPassword += possible.charAt(Math.floor(Math.random() * possible.length));


    //*********************hashing tempPassword and store it in database***************
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(tempPassword, salt, function (err, hash) {
            // Store hash in your password DB.
            console.log(hash);
            hashPassword = hash;
            console.log(hashPassword);
            db.query('UPDATE employee SET employee_password =$1 WHERE employee_email = $2', [hashPassword, recipient], (err, results) => {
                if (err) {
                    return console.error('error running query', err);
                }

            });
        });
    });


    //*******************************Email password to user**********************************************
    console.log(recipient);
    nodemailer.createTestAccount((err, account) => {
        if (err) {
            console.error('Failed to create a testing account. ' + err.message);
            return process.exit(1);
        }

        console.log('Credentials obtained, sending message...');

        // Create a SMTP transporter object
        let transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass
            }
        });

        // Message object
        let message = {
            from: 'Crater Inc.<password@craterinc.com>',
            to: 'Recipient' + '<' + recipient + '>',
            subject: 'Password Recovery',
            text: 'This is your password:  ' + tempPassword,
            html: 'This is your password:  ' + tempPassword

        };

        transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log('Error occurred. ' + err.message);
                return process.exit(1);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            var url = nodemailer.getTestMessageUrl(info);
            res.render('sent-message', { message: " " + url });
        });

    });


});

router.post('/', function (req, res, next) {

    //setting up sessions
    req.session.username = req.body.username;
    req.session.password = req.body.password;

    //connecting to database
    var username = req.body.username;
    var password = req.body.password;
    console.log(username);//for testing
    console.log(password);// for testing
    var context = {};
    var hashPassword;
    var status;

    //*********************bcrypt password*****************
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            // Store hash in your password DB.
            console.log(hash);
            hashPassword = hash;
            console.log(hashPassword);

        });
    });
    //********************************************************
    //console.log("again.." +hashPassword);
    //db.query('SELECT * FROM employee WHERE employee_email = $1 and employee_password =$2', [username, hashPassword], (err, results) => {
    db.query('SELECT * FROM employee WHERE employee_email = $1', [username], (err, results) => {

        if (err) {
            return console.error('error running query', err);
        }
        if (results.rowCount === 0) {
            console.log("rowcount is 0");
            console.log("Wrong username");
            res.render('sign-in', { error_message: "Incorrect Username or User Does Not Exist!" });
            return;
        }

        console.log(results);
        console.log(results.rows);
        var employee_first_name;
        var employee_type;
        context = {
            "employee_id": results.rows[0].employee_id,
            "employee_email": results.rows[0].employee_email,
            "employee_password": results.rows[0].employee_password,
            "access_date": results.rows[0].access_date,
            "signature": results.rows[0].signature,
            "department_id": results.rows[0].department_id,
            "employee_type": results.rows[0].employee_type,
            "admin_id": results.rows[0].admin_id,
            "employee_first_name": results.rows[0].employee_first_name,
            "employee_last_name": results.rows[0].employee_last_name
        };
        bcrypt.compare(password, results.rows[0].employee_password, function (err, reply) {
            reply === true;
            status = reply;
            console.log("The response is " + status);




            if (status == false) {

                console.log("Wrong Email or Password has entered");
                res.render('sign-in', { error_message: "Incorrect password was entered!" });
                return;


            }
            if (status == true) {
                // logged in as user
                if (results.rows[0].employee_type === "user") {
                    console.log("this is user");
                    res.setHeader('Content-Type', 'text/html');

                    res.render('dashboard', context);
                }

                    //logged in as admin
                else if (results.rows[0].employee_type === "admin") {
                    console.log("this is admin");
                    res.setHeader('Content-Type', 'text/html');
                    res.render('admin_main', context);
                }

            }

        })
    });

});



module.exports = router;

