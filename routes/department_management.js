const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', function(req, res){
  db.query('SELECT DISTINCT department_name FROM department GROUP BY department_name').then(function(dbResponse) {
    console.log(dbResponse.rows[0].department_name);
    var department_name = [];
    for (name in dbResponse.rows){
    department_name.push(dbResponse.rows[name].department_name);
  }
    res.render('department_management', {'department_name': department_name});
  });
});

router.post('/', function(req, res){
  db.query("INSERT INTO department WHERE department_name = $1", [req.body.department_name]).then(function(dbResponse){
    
  });
});

router.delete('/', function(req, res){

});

module.exports = router;
