const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: 'Ajaygoel@123',
  port: 5432,
});
const bcrypt = require("bcrypt");

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

  const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { name, email } = request.body
  
    pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3',
      [name, email, id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`User modified with ID: ${id}`)
      }
    )
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
