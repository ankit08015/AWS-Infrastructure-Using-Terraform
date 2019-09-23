const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: 'Ajaygoel@123',
  port: 5432,
});
const bcrypt = require("bcrypt");
var validator = require("email-validator");
var passwordValidator = require('password-validator');
var schema = new passwordValidator();
schema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                 // Must have digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']);

const getUsers = (request, response) => {
    console.log("Here");
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const getUserById = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  const createUser = (request, response) => {
     const { first_name, last_name, email, password } = request.body;
     const created_date = new Date();
     const updated_date = new Date();
     
     console.log("Here");
    const email_check = request.body.email;
    const password_check = request.body.password;
    console.log(schema.validate(request.body.password));
    console.log(email_check);

    if(validator.validate(email_check) && schema.validate(password_check)){
    
    pool.query('SELECT * FROM users WHERE email = $1', [email_check], (error, results) => {
      if (results.rows.length>=1) {
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
                pool.query('INSERT INTO users (first_name, last_name,email,password, created_date, updated_date ) VALUES ($1,$2,$3,$4,$5,$6)'
                , [first_name, last_name, email, hash, created_date, updated_date ], (error,results) => {
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

      //response.status(200).json(results.rows)
    })
} else {
    response.status(401).json({
        message: "Invalid Email or password..!!",
        "password_guidelines: ": ["Minimum length 8","Maximum length 100","Must have uppercase letters",
                            "Must have lowercase letters","Must have digits","Should not have spaces"],
        "Status code": 401
    });
}
}

  const updateUser = (request, response) => {
    const email = request.body.email;
    console.log(email);

    const { first_name, last_name, password } = request.body;
    const email_check = request.body.email;
    const password_check = request.body.password;
    const updated_date = new Date();

    pool.query('SELECT * FROM users WHERE email = $1', [email_check], (error, results) => {
        if (results.rows.length==0) {
          response.status(400).json({
              message: "User Email doesn't exist..!!"
          });
        } else {
            if(validator.validate(email_check) && schema.validate(password_check)){
                bcrypt.hash(request.body.password, 10, (err, hash) => { 
                    if (err) {
                      return res.status(500).json({
                        error: err
                      });
                    } else {
                        pool.query(
                            'UPDATE users SET first_name = $1, last_name = $2, password =$3, updated_date =$4 WHERE email = $5',
                            [first_name, last_name, password, updated_date,email],
                            (error, results) => {
                              if (error) {
                                throw error
                              }
                              response.status(200).send(`User modified with ID: ${email}`)
                            }
                        );
                    }
                });
            } else {
                response.status(401).json({
                    message: "Invalid Email or password..!!",
                    "password_guidelines: ": ["Minimum length 8","Maximum length 100","Must have uppercase letters",
                                        "Must have lowercase letters","Must have digits","Should not have spaces"],
                    "Status code": 401
                });
            }
        }
    });

    // pool.query(
    //   'UPDATE users SET first_name = $1, last_name = $2, password =$3 WHERE email = $4',
    //   [first_name, last_name, password, email],
    //   (error, results) => {
    //     if (error) {
    //       throw error
    //     }

    //     response.status(200).send(`User modified with ID: ${email}`)
    //   }
    // )
  }

  const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User deleted with ID: ${id}`)
    })
  }

  module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
  }
