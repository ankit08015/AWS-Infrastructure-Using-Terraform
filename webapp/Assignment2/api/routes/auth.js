const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require("bcrypt");

//VALIDATION
// const Joi = require('@hapi/joi');
// const schema = {
//     name: Joi.string().min(6).required(),
//     email: Joi.string().min(6).required().email(),
//     password: Joi.string().min(6).required()

// }

router.post("/register", (req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length >= 1) {
          return res.status(409).json({
            message: "User with this E-mail exists..!!"
          });
        } else {
            // bcrypt -- hash -- salt (how many random numbers)
            bcrypt.hash(req.body.password, 10, (err, hash) => { 
                if (err) {
                  return res.status(500).json({
                    error: err
                  });
                } else {
                  const user = new User({
                    //_id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: hash
                  });
                  user
                    .save()
                    .then(result => {
                      console.log(result);
                      res.status(201).json({
                        message: "User created"
                      });
                    })
                    .catch(err => {
                      console.log(err);
                      res.status(500).json({
                        error: err
                      });
                    });
                }
              });
            }
          });
      });

// router.post('/register', async (req, res) => {

//     //validate the data
//     //const validation = Joi. validate(req.body, schema);
//     //res.send(validation);

//     const user = new User({
//         name: req.body.name,
//         email: req.body.email,
//         password: req.body.password
//     });
//     try{
//         const savedUser = await user.save();
//         res.send(savedUser); 
//         res.send('User is registered now..!!');
//     } catch(err) {
//         res.send(err);
//         res.status(400).send(err);
//     }
// });



module.exports = router;