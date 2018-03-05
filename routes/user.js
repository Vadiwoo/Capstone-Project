const express = require('express');
const router = express.Router();

const db = require('../db')
var bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/:userEmail', function(req,res){
  var payload;
  db.query('SELECT * FROM employee WHERE employee_email = $1',[req.params.userEmail], (err, results) => {
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

router.post('/', function(req,res){
  console.log(req.body);

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      // Store hash in your password DB.
      db.query("INSERT INTO employee (employee_first_name, employee_last_name, employee_email, employee_type, employee_password, access_date) VALUES($1, $2, $3, $4, $5, $6) ON CONFLICT (employee_email) DO UPDATE SET employee_first_name = EXCLUDED.employee_first_name, employee_last_name = EXCLUDED.employee_last_name, employee_email = EXCLUDED.employee_email, employee_type = EXCLUDED.employee_type, employee_password = EXCLUDED.employee_password WHERE employee.employee_email = $3", [
        req.body.firstName, req.body.lastName, req.body.email, req.body.type, hash, (new Date()).toISOString()
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
