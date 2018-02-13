// Code taken from https://node-postgres.com/features/pooling

const { Pool } = require('pg')

const pool = new Pool({
  connectionString : "pg://nhwljdkwkfhnoy:7a2f32711c734a5d67cfc0a1e59acc91654193795d8655de7ae0cfb27b630390@ec2-174-129-22-84.compute-1.amazonaws.com:5432/dfh46ttrtrflgb",
  ssl : true

})

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  }
}
