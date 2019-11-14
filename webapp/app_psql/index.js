const express = require('express')
const bodyParser = require('body-parser')
morgan = require('morgan')
const app = express()
const PORT = 3000;

const busboy = require('connect-busboy');
const busboyBodyParser = require('busboy-body-parser');

var winston = require('./config/winston');

//const db = require('./Routes/queries')

const db = require('./config/database');

// Test DB
// db.authenticate()
//   .then(() => console.log('Database connected.'))
//   .catch(err => console.log('Error: ' + err))

app.use(morgan('combined', { stream: winston.stream }));

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

//File upload related
app.use(busboy());
app.use(busboyBodyParser());

app.get('/', (request, response) => {
  response.json({
    info: 'Node.js, Express, and Postgres API'
  })
});

//app.get('/v2',(req,res) => res.send('INDEX'));
app.use('/v2',require('./Routes/queries'))
app.use('/v2',require('./Routes/recipie'))
app.use('/v2',require('./Routes/upload'))
//app.get('/v1/user/self', require('./Routes/queries'))
//app.post('/v1/user', db.createUser)
//app.put('/v1/user/self', db.updateUser)
//app.get('/', db.get)

// app.listen(port, () => {
//   console.log(`App running on port ${port}.`)
// });

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log('Express listening on port:', PORT);
  });
});