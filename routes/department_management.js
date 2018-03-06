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
  console.log(req.body.department_name);
  db.query("INSERT INTO department (department_name) VALUES($1)", [req.body.department_name], (err, results) => {
    if(err && err.code == '23505') {
      res.status(409).send();
    }
    else {
      res.status(200).send();
    }
  });
});

router.delete('/:department_name', function(req, res){

  db.query("DELETE FROM department WHERE department_name = $1", [req.params.department_name], (err, results) => {
    if(err) {
      res.status(500).send();
    } else {
      res.status(200).send();
    }

  });
});

module.exports = router;
