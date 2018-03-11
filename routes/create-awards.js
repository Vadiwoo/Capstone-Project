/*modified from: https://stackoverflow.com/questions/43186885/node-js-render-and-compile-latex-file-via-a-child-process
https://ethereal.email/ and https://github.com/nodemailer/nodemailer/blob/master/examples/full.js */

const express = require('express');
const router = express.Router();
const { Client } = require('pg');
var path = require("path");
var mu = require("mu2");
var fs = require("fs-extra");
const db = require('../db');
const nodemailer = require('nodemailer');
var spawn = require("child_process").spawnSync;

router.get('/', (req, res) => {
	res.render('create-awards');
});

router.post('/', (req, res) => {
	
	//Create-award user inputs
	var awardType = req.body.award_type;
	var winFirst = req.body.winnerFirstName;
	var winLast = req.body.winnerLastName;
	var winEmail = req.body.winnerEmail;
	var date = req.body.dateCreated;
	var creatorFirst;
	var creatorLast;
	var employee_id;

	//folder with the images used for the latex document creation
	var string = "";
	var templateFolder = "/app/public/images/";
	console.log('before first query');
	//getting award creator id
	db.query('SELECT * FROM employee WHERE employee_email = $1',[req.session.username], (err, results) => {
		console.log(req.session.username);
		if(results.rowCount === 0) {
			res.status(404).send("User Does Not Exist");
		}
		else {

			employee_id = results.rows[0].employee_id;
			creatorFirst =  results.rows[0].employee_first_name;
			creatorLast = results.rows[0].employee_last_name;
		}

		console.log("before second query");
		//inserting award into database
		db.query("INSERT into award (award_name, creator, recipient, award_created,employee_id, recipient_first) VALUES($1, $2, $3, $4, $5, $6)", [awardType, creatorLast, winLast, date,employee_id, winFirst],(err, results) => {
			if (err) {
				return console.error('error running query', err);
			}
			else {
				//mu2 is used to replace the key words with the user inputs {{ award_type }}
				//Pulls from the root and compiles and renders the changes
				mu.root = templateFolder;
				mu.compileAndRender("certTex.tex", {"award_type": awardType, "winnerFirstName": winFirst, "winnerLastName": winLast, "date": date, "creatorFirstName": creatorFirst, "creatorLastName": creatorLast})
				//Data is set to a string
				.on("data", function (data) {
					string = string + data.toString();
				})
				.on("end", function () {
					
					//Set tex documents folder and creates a unique file name for each document
					var latexFolder = "/app/public/images/texFolder";
					var fileName = (winLast + date + ".tex");
					var file = latexFolder + "/" + winLast + date + ".tex";
					console.log("full file name = " + file);
					
					//Create the rendered file and compile
					'use strict';
					console.log(string);
					fs.writeFileSync(file, string); //, function (err) {
						// if (err) {         
						// 	throw 'error writing file: ' + err;
						// } else {
							if(fs.existsSync(file)) {
								console.log("FILE EXISTS RIGHT NOW");
							} else {
								console.log("File not exist :(");
							}
							console.log(file);
							
							//Creates the pdf from the tex document with latexmk found within the texLive buildpack
							var pdfLatex = spawn("latexmk", ["-outdir=" + latexFolder, "-pdf", file], {stdio: 'inherit'});
							// pdfLatex.stdout.on("end", function (data) {
								var pdfFileName = winLast + date + '.pdf';
					
								// Generate SMTP service account from ethereal.email to send PDF
								console.log('before test accounts');
								nodemailer.createTestAccount((err, account) => {
									if (err) {
										console.error('Failed to create a testing account');
										console.error(err);
										return process.exit(1);
									}
									
									// Create a SMTP transporter object
									let transporter = nodemailer.createTransport({
										host: account.smtp.host,
										port: account.smtp.port,
										secure: account.smtp.secure,
										auth: {
											user: account.user,
											pass: account.pass
										},
										logger: false,
										debug: false // include SMTP traffic in the logs
									});
									console.log("before message");

									if(fs.existsSync(file)) {
										console.log("TEX FILE EXISTS");
									} else {
										console.log("File not exist :(");
									}

									if(fs.existsSync(latexFolder + "/" + pdfFileName)){
										console.log("PDF FILE EXISTS");
									} else {
										console.log("PDF FILE NOT EXIST");
									}

									// Message object
									let message = {
										from: 'CraterInc <no-reply@craterInc.com>',  //sender info
										to: winFirst + winLast + '<' + winEmail + '>', //Comma separated list of recipients: 'Russel Metzger<rmetzger@craterinc.com>',
										subject: 'Certificate ✔',
										text: 'Congratulations!',  //plaintext
										html: '<p><b>Congratulations</b></p>' +  //HTML body with 2 lines
										'<p>Here\'s a certificate for you as an embedded attachment:<br/><img src="cid:nyan34@example.com"/></p>', //cid matches below
										attachments: [   // An array of attachments
											// File Stream attachment
											{
												filename:  pdfFileName,    //'latexCertEx2.pdf',
												path: latexFolder + "/" + pdfFileName,
												cid: 'nyan34@example.com' // should be as unique as possible and match cid above
											}
										]
									};

									console.log("sending mail");
									transporter.sendMail(message, (error, info) => {
										if (error) {
											console.log('Error occurred');
											console.log(error.message);
											 return process.exit(1);
										}

										console.log('Message sent successfully!');
										console.log(nodemailer.getTestMessageUrl(info));
										var url = nodemailer.getTestMessageUrl(info);
										res.render('send-award', {message: " " + url, succesful_message: "Your Award Profile has been Sent Successfully!" });
									});
								});

				}).on("error", function(err) {
					console.log("error with mu");
				});
			}
		});
	});

});

module.exports = router;
