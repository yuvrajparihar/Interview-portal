require("dotenv").config();
const mysql = require('mysql');


var mysqlConnnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.PASSWORD,
    database:process.env.DATABASE,
    multipleStatements: true
  });

// var mysqlConnnection = mysql.createConnection({
//   host: process.env.HOST,
//   user: process.env.USER,
//   password: process.env.PASSWORD,
//   database:process.env.DATABASE,
//   multipleStatements: true
// });
  
  mysqlConnnection.connect(function(err) {
    if (err) throw err
    else{
        console.log("Connected!");
    }
   
  });


  module.exports = mysqlConnnection;