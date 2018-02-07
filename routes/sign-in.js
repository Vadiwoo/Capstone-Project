const express = require('express');
const router = express.Router();
//const database = require('database');
const expressSession = require('express-session');

var pg = require('pg');


const { Client } = require('pg');

const client = new Client({
  connectionString : "pg://nhwljdkwkfhnoy:7a2f32711c734a5d67cfc0a1e59acc91654193795d8655de7ae0cfb27b630390@ec2-174-129-22-84.compute-1.amazonaws.com:5432/dfh46ttrtrflgb",
  ssl: true,
});


router.get('/', (req, res) => {
    res.render('sign-in');
});

router.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

router.post('/', function(req, res,next) {

	var username = req.body.username;
	var password = req.body.password;
	console.log(username);//for testing
	console.log(password);// for testing
	var context = {};
	var userRole;
	

    
	client.connect((err,done) => {
	    if (err) {
	       
	        console.error('connection error', err.stack)
      	
	    } else {
	        console.log('connected to database')
	    }
	
 

	client.query('SELECT * FROM employee WHERE employee_email = $1 and employee_password =$2',[username,password], (err, results) => {
	  
	    if (err) {
	        return console.error('error running query', err);
	    }
	 
	    console.log(results);
	    console.log(results.rows);
  
	    if(results.rowCount==0)
	    {
	        console.log("Wrong Email or Password has entered");
	        res.setHeader('Content-Type', 'text/html');
            res.render('sign-in')
     
	    }
	    if(results.rowCount==1){
	        context.results = results;
	        if (results.rows[0].employee_type === "user")
	        {
	            console.log("this is user");
	            // res.send(results); // writing  the resulsts on the same page(sign-in.hbs)
	            res.setHeader('Content-Type', 'text/html');
	            res.render('dashboard', context);
	        }
	        else if (results.rows[0].employee_type === "admin")
	        {
	            console.log("this is admin");
	            // res.send(results); // writing  the resulsts on the same page(sign-in.hbs)
	            res.setHeader('Content-Type', 'text/html');
	            res.render('admin', context);
	        }
	        
	       
	    }
	  
	    client.end();
	    })
	
	
	});
 


});

module.exports = router;


