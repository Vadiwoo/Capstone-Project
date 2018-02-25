const express = require('express');
const router = express.Router();

const db = require('../db')

router.get('/', (req, res) => {
  res.render('business_analytics');
});

router.get('/query', (req, res) => {
  var queryName = req.query.queryName;
  switch (queryName) {
    case "userType":
      queryUserType().then(function(queryRes){
        res.send(queryRes);
      });
    break;
    default:
  }
});

function queryUserType() {
  return db.query('SELECT employee_type, COUNT(employee_type) FROM employee GROUP BY employee_type');
}

function queryUserByDepartment() {
//SELECT department_name, COUNT(department_name) FROM department LEFT JOIN employee on (department.department_id = employee.department_id) GROUP BY department_name
}
module.exports = router;
