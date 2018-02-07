const express = require('express');
const router = express.Router();
//const database = require('database');
const expressSession = require('express-session');

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
	var results = [];
	
	//getQueryResults(result,username,password);
    //console.log(result);
    
	client.connect((err,done) => {
	    if (err) {
	       
	        console.error('connection error', err.stack)
      	
	    } else {
	        console.log('connected to database')
	    }
	
 

	client.query('SELECT * FROM employee WHERE employee_email = $1 and employee_password =$2',[username,password], (err, res) => {
	    //done();
	    if (err) {
	        return console.error('error running query', err);
	    }
	    //res.send(results);
         
	    if (err) throw err;
	    console.log(res);
	   // console.log(results);
	   
	    console.log(res.rowCount);
	    if(res.rowCount==0)
	    {
	        console.log("Wrong Email or Password has entered");
	       
	    }
	   // res.status(200).send(res);
	   
	    })
	
	//client.end();
	});
 
	console.log("this is the count", res.rowCount);
	console.log("and the results", res);
	var entry = res.rowCount;
	
	var userID;
    
	for (i = 0; i < entry; i++){
	    if(( res.rows[i].employee_email === username) && (res.rows[i].employee_password === password))
	    {
	        userFirstName = res.rows[i].employee_first_name;
	        userID = res.rows[i].employee_id;
	        console.log(userFirstName);
	        success = true;
	        if (res.rows[i].employee_type === "admin")
	        {
	            console.log("this is admin");
	            userRole = "admin";
	        }
	        else if (res.rows[i].employee_type === "user") 
	        {
	            console.log("this is user");
	            userRole = "employee";
	            console.log("I am here at AAA");
	        }     

	    }           
	};
	
    
	console.log(res);
	//res.redirect('/dashboard');
	res.render('dashboard');
      
});



module.exports = router;
