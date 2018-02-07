const express = require('express');
const router = express.Router();
const { Client } = require('pg');


const client = new Client({
    connectionString: "pg://nhwljdkwkfhnoy:7a2f32711c734a5d67cfc0a1e59acc91654193795d8655de7ae0cfb27b630390@ec2-174-129-22-84.compute-1.amazonaws.com:5432/dfh46ttrtrflgb",
    ssl: true,
});
/*
client.connect((err) => {
    if (err) {
        console.error('connection error', err.stack)

    } else {
        console.log('connected')
    }
})
*/
module.exports = router;