const Pool = require('pg').Pool
const pool = new Pool({
<<<<<<< HEAD
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: 'Ajaygoel@123',
=======
  user: "me",
  host: "localhost",
  database: "api",
  password: "Ajaygoel@123",
>>>>>>> 8e08598173dfaf3eb0a01efcec7a9a1999760061
  port: 5432,
});

const getUsers = (request, response) => {
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
    const { name, email } = request.body
  
    pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
      if (error) {
        throw error
      }
    //   const data;
    //   pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
    //     if (error) {
    //       throw error
    //     }
    //     response.status(200).json(results.fields.id)
    //     // data = results;
    //   })
        response.status(201).send(`User added with ID: ${results.rows}`);
    })
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
