const express = require('express');
const router = express.Router();
const db = require('../db')
const { Client } = require('pg');


router.get('/', (req, res) => {
    var payload;
  
    var context = {};
    db.query('SELECT * FROM employee WHERE employee_email = $1',[req.session.username], (err, results) => {
        console.log(req.session.username);
        if(results.rowCount === 0) {
            console.log("rowcount is 0");
            res.status(404).send("User Does Not Exist");
        }
        else {
            
            var employee_id = results.rows[0].employee_id;
            db.query('SELECT * FROM award WHERE employee_id = $1',[employee_id], (err, results) => {
                if(results.rowCount === 0) {
                    console.log("Sorry, No awards found.");
                    award_history = "Sorry, No awards found.";
                    res.status(404).send("User Does Not Exist");
                }
                else 
                { 
                    console.log(results.rows)
                    payload = results.rows;
                    console.log("I am in else statement");
                    context.results= results.rows;
                    //console.log(context.results);
                    console.log("I am after context.results statement");
                    console.log("The length is ", +payload.length)
                    
                    
                    for (count=0; count<payload.length; count++)
                    {
                        payload[count].id= results.rows[count].award_id;
                        payload[count].name= results.rows[count].award_name;
                        payload[count].recipient= results.rows[count].recipient;
                        payload[count].date= results.rows[count].award_created;
                    }
                       
                    context.payload= payload;  
                }
                res.render('user-delete-award', context);
            });
        };
        
       
     
 
    });  
});

router.post('/deleteAward', function(req, res){
   // var emp_id = [req.params.id];
    console.log("this is the id",+[req.body.id]);
    //console.log("emp_id is" , +emp_id )
    db.query('DELETE FROM award WHERE award_id = $1',[req.body.id], (err, results) => {
        if (err) {
            return console.error('error running query', err);
        
        }
        else 
        {
            console.log("Any issue here?")
           // return res.send({deleteMessage:"Selected row has been succesfully deleted from your record!"});
            // res.render('delete-succesful',{deleteMessage:"Selected row has been succesfully deleted from your record!"});
            return res. redirect('/user-delete-award');
            
        }
       
        console.log("Did you reach here?")
    });

 
});
/***********
router.get('/updateHistory', function(req, res){

    res.render('user-delete-award',{deleteMessage:"Selected row has been succesfully deleted from your record!"});


});

*************/
module.exports = router;