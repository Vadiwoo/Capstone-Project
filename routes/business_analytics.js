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

    case "createdOnDays":
    queryCreatedOnDays().then(function(queryRes) {
      res.send(queryRes);
    });
    break;
    case "awardsPerDay":
    queryAwardsPerDay().then(function(queryRes) {
      res.send(queryRes);
    });
    break;
    case "topThreeCreators":
    queryTopThreeCreators().then(function(queryRes) {
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

function queryCreatedOnDays() {
  return db.query("SELECT date_part('year', access_date) y, date_part('month', access_date) m, date_part('day', access_date) d, COUNT (*) FROM employee GROUP BY (y,m,d)");
}

function queryAwardsPerDay() {
  return db.query("SELECT date_part('year', award_created) y, date_part('month', award_created) m, date_part('day', award_created) d, COUNT (*) FROM award GROUP BY (y,m,d)");
}

function queryTopThreeCreators() {
  return db.query('SELECT creator, COUNT(*) FROM award GROUP BY creator ORDER BY count DESC');
}
module.exports = router;