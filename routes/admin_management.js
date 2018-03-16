const express = require('express');
const router = express.Router();

const db = require('../db');

router.get('/', function(req,res){
  db.query('SELECT DISTINCT department_name FROM department GROUP BY department_name').then(function(dbResponse) {
    console.log(dbResponse.rows[0].department_name);
    var department_name = [];
    for (name in dbResponse.rows){
    department_name.push(dbResponse.rows[name].department_name);
  }
    res.render('admin_management', {'department_name': department_name});
  });
});

module.exports = router;
