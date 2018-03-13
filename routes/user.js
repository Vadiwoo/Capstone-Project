const express = require('express');
const router = express.Router();
var multer = require("multer");
var fs = require("fs");
const db = require('../db')
var bcrypt = require('bcrypt');
const upload = multer({
  dest: './public/temp_signature'
});

/* GET users listing. */
router.get('/:userEmail', function(req,res){
  var payload;
  db.query('SELECT employee_first_name, employee_last_name, employee_email, employee_type, department_name FROM employee LEFT JOIN department ON employee.department_id = department.department_id WHERE employee_email = $1',[req.params.userEmail], (err, results) => {
    // console.log(req.params.userEmail);
    if(results.rowCount === 0) {
      console.log("rowcount is 0");
      res.status(404).send("User Does Not Exist");
    }
    else {
      payload = results.rows;
      res.send(payload);
    }
  });
});

//modified from http://stackabuse.com/encoding-and-decoding-base64-strings-in-node-js/#encodingbinarydatatobase64strings
router.post("/upload/signature", upload.single('file'), function(req, res) {
    'use strict';

    let buff = fs.readFileSync(req.file.path);
    let base64File = buff.toString('base64');

    db.query("UPDATE employee SET signature = $1 WHERE employee.employee_email = $2", [base64File, req.body.email], (err, results) => {
      if(err) {
        console.log(err);
      }
      else {
        res.status(200).send("Finished");
      }
      console.log("unlinked file");
      fs.unlink(req.file.path);
    });
});

router.post('/', function(req,res) {
  console.log(req.body);
  //we'll need to hash the password if it is new
  if(req.body.isNew == true){
    console.log("creating new user");
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(req.body.password, salt, function (err, hash) {
        // Store hash in your password DB.
        db.query("INSERT INTO employee (employee_first_name, employee_last_name, employee_email, employee_type, employee_password, access_date, department_id) VALUES($1, $2, $3, $4, $5, $6, (SELECT department_id FROM department WHERE department_name = $7))", [
          req.body.firstName, req.body.lastName, req.body.email, req.body.type, hash, (new Date()).toISOString(), req.body.department_name
        ], (err, results) => {
          if(!err) {
            res.status(200).send("User added/updated");
          } else{
            console.log(err);
            res.status(500).send("Unknown server error when inserting/updating");
          }
        });
      });
    });
  } else {
    console.log("editing user");
    //if there's a new password, hash it and upload everything.
      if(req.body.password ==='') {
        db.query('UPDATE employee SET employee_first_name = $1, employee_last_name = $2, employee_type =$3, department_id=(SELECT department_id FROM department WHERE department_name = $4) WHERE employee_email = $5', [req.body.firstName, req.body.lastName, req.body.type,req.body.department_name, req.body.email], (err, results) =>{
          if(!err) {
            res.status(200).send("User updated");
          } else{
            console.log(err);
            res.status(500).send("Unknown server error when inserting/updating");
          }
        });
      } else {
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(req.body.password, salt, function (err, hash) {
            // Store hash in your password DB.
            db.query("UPDATE employee SET employee_first_name = $1, employee_last_name = $2, employee_type =$3, department_id=$4, employee_password = $5 WHERE employee_email = $6", [req.body.firstName, req.body.lastName, req.body.type,req.body.department_name, hash, req.body.email], (err, results) => {
              if(!err) {
                res.status(200).send("User updated");
              } else{
                console.log(err);
                res.status(500).send("Unknown server error when inserting/updating");
              }
            });
          });
        });
      }
    //else if there's no update to teh password, upload everything EXCEPT the password
  }
});

router.delete('/', function(req,res){
  console.log(req.body)
  db.query('DELETE FROM employee WHERE employee.employee_email = $1',[req.body.email], (err, results) => {
    console.log(req.body.email);
    if(err) {
      res.status(404).send("Error deleting user profile");
    }
    else {
      res.status(200);
    }
  });
});

module.exports = router;
