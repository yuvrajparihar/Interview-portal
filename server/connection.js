require("dotenv").config();
const mysql = require('mysql2');


var mysqlConnnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database:process.env.DATABASE,
    multipleStatements: true,
    port: 5437
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