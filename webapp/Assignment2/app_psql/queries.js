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
     const created_date = Date.now;
     const updated_date = Date.now;
     
     console.log("Here");
        // pool.query('INSERT INTO users (first_name, last_name,email,password ) VALUES ($1,$2,$3,$4)'
        // , [first_name, last_name, email, password ], (error,results) => {
        // if (error) {
        //     console.log(error);
        //     throw error
        //   }
        //   response.status(201).json({
        //     message: "User added",
        //     details: request.body
        //   });
        // });
    // const { first_name, last_name,email,password } = request.body;
    // const created_date = Date.now;
    // const updated_date = Date.now;
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
                pool.query('INSERT INTO users (first_name, last_name,email,password ) VALUES ($1,$2,$3,$4)'
                , [first_name, last_name, email, hash ], (error,results) => {
                if (error) {
                    console.log(error);
                    throw error
                }
                response.status(201).json({
                    message: "User added",
                    details: request.body,
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
    pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, password =$3 WHERE email = $4',
      [first_name, last_name, password, email],
      (error, results) => {
        if (error) {
          throw error
        }

        response.status(200).send(`User modified with ID: ${email}`)
      }
    )
    // const id = parseInt(request.params.id)
    // const { name, email } = request.body
  
    // pool.query(
    //   'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    //   [name, email, id],
    //   (error, results) => {
    //     if (error) {
    //       throw error
    //     }
    //     response.status(200).send(`User modified with ID: ${id}`)
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
