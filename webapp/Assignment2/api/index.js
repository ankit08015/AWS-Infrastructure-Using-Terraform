// npm install dotenv
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

//Importing routes
const authRoute  = require('./routes/auth');

//connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => console.log('connected to DB!'));

//Middleware
app.use(express.json());

//Route Middleware
app.use('/api/user', authRoute); //prefix

app.listen(3000, () => console.log('Server Up and Running'));