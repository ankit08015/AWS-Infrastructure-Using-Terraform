
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Gig = require('../Model/Gig');

const Pool = require('pg').Pool
const pool = require('../config/database');
// const pool = new Pool({
//   user: 'me',
//   host: 'localhost',
//   database: 'api',
//   password: 'Ajaygoel@123',
//   port: 5432,
// });
const bcrypt = require("bcrypt");
var validator = require("email-validator");
var passwordValidator = require('password-validator');
var schema = new passwordValidator();
schema
  .is().min(8) // Minimum length 8
  .is().max(100) // Maximum length 100
  .has().uppercase() // Must have uppercase letters
  .has().lowercase() // Must have lowercase letters
  .has().digits() // Must have digits
  .has().not().spaces() // Should not have spaces
  .is().not().oneOf(['Passw0rd', 'Password123']);

const getUsers = (request, response) => {

  // check for basic auth header
  if (!request.headers.authorization || request.headers.authorization.indexOf('Basic ') === -1) {
    return response.status(401).json({
      message: 'Missing Authorization Header'
    });
  }

  // verify auth credentials
  const base64Credentials = request.headers.authorization.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  pool.query('SELECT * from users where email = $1', [username], (error, results) => {
    if (error) {
      throw error
    } else if (results.rows.length == 0) {
      response.status(401).json({
        message: 'Authorization failed'
      });
    } else {

      const db_password = results.rows[0].password;

      bcrypt.compare(password, db_password, (err, result) => {
        if (err) {
          result.status(400).json({
            message: 'Bad Request'
          });
        }
        if (result) {
          response.status(200).json(results.rows);
        } else {
          response.status(403).json({
            message: 'Unauthorized Access Denied'
          });
        }
      });
    }
  })
}

const createUser = (request, response) => {
  const {
    first_name,
    last_name,
    email,
    password
  } = request.body;
  const created_date = new Date();
  const updated_date = new Date();


  const email_check = request.body.email;
  const password_check = request.body.password;


  if (validator.validate(email_check) && schema.validate(password_check)) {

    pool.query('SELECT * FROM users WHERE email = $1', [email_check], (error, results) => {
      if (results.rows.length >= 1) {
        response.status(400).json({
          message: "User Email exists..!!"
        });
        //throw error;
      } else {
        bcrypt.hash(request.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            pool.query('INSERT INTO users (first_name, last_name,email,password, created_date, updated_date ) VALUES ($1,$2,$3,$4,$5,$6)', [first_name, last_name, email, hash, created_date, updated_date], (error, results) => {
              if (error) {
                console.log(error);
                throw error
              }
              response.status(201).json({
                message: "User added",
                details: request.body,
                "created_date": created_date,
                "updated_date": updated_date,
                password: hash
              });
            });
          }
        });
      }

    })
  } else {
    response.status(401).json({
      message: "Invalid Email or password..!!",
      "password_guidelines: ": ["Minimum length 8", "Maximum length 100", "Must have uppercase letters",
        "Must have lowercase letters", "Must have digits", "Should not have spaces"
      ],
      "Status code": 401
    });
  }
}

const updateUser = (request, response) => {

  // check for basic auth header
  if (!request.headers.authorization || request.headers.authorization.indexOf('Basic ') === -1) {
    return response.status(401).json({
      message: 'Missing Authorization Header'
    });
  }

  // verify auth credentials
  const base64Credentials = request.headers.authorization.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  pool.query('SELECT * from users where email = $1', [username], (error, results) => {
    if (error) {
      throw error
    } else if (results.rows.length == 0) {
      response.status(401).json({
        message: 'Authorization failed'
      });
    } else {

      const db_password = results.rows[0].password;
      //console.log("db pass " + results.rows[0].password);
      bcrypt.compare(password, db_password, (err, result) => {
        if (err) {
          result.status(400).json({
            message: 'Bad Request'
          });
        }
        if (result) {
          const email = username;
          console.log(email);

          const {
            first_name,
            last_name,
            password
          } = request.body;

          const password_check = request.body.password;
          const updated_date = new Date();
          if (schema.validate(password_check)) {
            bcrypt.hash(request.body.password, 10, (err, hash) => {
              if (err) {
                return res.status(500).json({
                  error: err
                });
              } else {
                pool.query(
                  'UPDATE users SET first_name = $1, last_name = $2, password =$3, updated_date =$4 WHERE email = $5',
                  [first_name, last_name, hash, updated_date, email],
                  (error, results) => {
                    if (error) {
                      throw error
                    }
                    response.status(200).json({
                      message: `User modified with ID: ${email}`
                    });
                  }
                );
              }
            });
          } else {
            response.status(401).json({
              message: "Invalid password"
            });
          }
        } else {
          response.status(401).json({
            message: 'Authorization failed'
          });
        }
      });
    }
  })
}

module.exports = {
  getUsers,
  createUser,
  updateUser
}