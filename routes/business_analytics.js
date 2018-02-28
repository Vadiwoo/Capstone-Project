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

    case "userByDepartment":
    var scope = req.query.scope;
    queryByDepartment(scope).then(function(queryRes){
      res.send(queryRes);
    });
    break;

    case "awardsByType":
    queryAwardsByType().then(function(queryRes) {
      res.send(queryRes);
    });
    break;
    default:
  };
});

function queryUserType() {
  return db.query('SELECT employee_type, COUNT(employee_type) FROM employee GROUP BY employee_type');
}

function queryByDepartment(scope) {
  if(scope === 'all'){
    return db.query('SELECT department.department_name, COUNT(department.department_name) FROM department LEFT JOIN employee on (department.department_id = employee.department_id) GROUP BY department.department_name');
  }
  else {
    return db.query('SELECT department.department_name, COUNT(department.department_name) FROM department LEFT JOIN employee on (department.department_id = employee.department_id) WHERE employee.employee_type = $1 GROUP BY department.department_name', [scope]);
  }
}

function queryAwardsByType() {
  return db.query('SELECT award_name, COUNT(award_name) FROM award GROUP BY award_name');
}

function queryUsersByDepartment() {
  return db.query('');
}

module.exports = router;
