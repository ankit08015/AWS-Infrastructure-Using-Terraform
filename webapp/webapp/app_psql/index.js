const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000;
const db = require('./Routes/queries')

const check_db = require('./config/database');

// Test DB
check_db.authenticate()
  .then(() => console.log('Database connected.'))
  .catch(err => console.log('Error: ' + err))

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({
    info: 'Node.js, Express, and Postgres API'
  })
});

//app.get('/v2',(req,res) => res.send('INDEX'));
app.use('/v1',require('./Routes/queries'))
//app.get('/v1/user/self', db.getUsers)
//app.post('/v1/user', db.createUser)
//app.put('/v1/user/self', db.updateUser)
//app.get('/', db.get)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
});