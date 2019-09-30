const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Gig = require('../Model/recipe');
const Gig_user = require('../Model/user');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require("bcrypt");



////POST

router.post('/recipie', (req, res) => {

    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({
            message: 'Missing Authorization Header'
        });
    }

    // verify auth credentials
    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');
    //const result;

    Gig_user.findAll({
            where: {
                email: email
            }
        })
        .then(data => {
            let user_authorized = false;
            const author_id = data[0].id;
            if (data[0] != undefined) {
                const db_password = data[0].password;
                bcrypt.compare(password, db_password, (err, result) => {

                    //result= true;
                    if (err) {
                        res.status(400).json({
                            message: 'Bad Request'
                        });
                    } else if (result) {

                        const {
                            title,
                            cook_time_in_min,
                            prep_time_in_min,
                            cusine,
                            servings,
                            ingredients
                        } = req.body;
                        
                        const total_time_in_min = cook_time_in_min + prep_time_in_min;
                        Gig.create({
                            author_id,
                            cook_time_in_min,
                            title,
                            prep_time_in_min,
                            total_time_in_min,
                            cusine,
                            servings,
                            ingredients
                            })
                            .then(gig => res.sendStatus(200))
                            .catch(err => res.status(401).json({
                                message:err.message
                            }));
                    } else {
                        res.status(403).json({
                            message: 'Unauthorized Access Denied'
                        });
                    }
                })
            } else {
                res.status(400).json({
                    "message": "Email doesn't exist"
                }); // return wrong email
            }
        })
        .catch();

})

////// DELETE

router.delete('/recipie/:id', (req, res) => {
    Gig_user.findAll({
        where: {
            email: email
        }
    })
    .then(data => {
        let user_authorized = false;
        const author_id = data[0].id;
        if (data[0] != undefined) {
            const db_password = data[0].password;
            bcrypt.compare(password, db_password, (err, result) => {

                //result= true;
                if (err) {
                    res.status(400).json({
                        message: 'Bad Request'
                    });
                } else if (result) {

                    const {
                        recipe_id
                    } = req.params.id;
                    
                    Gig.destroy({
                            where : { id : recipe_id}
                        })
                        .then(deletedRecipe => res.Status(200).json({
                            deletedRecipe
                        }))
                        .catch(err => res.status(401).json({
                            message:err.message
                        }));
                } else {
                    res.status(403).json({
                        message: 'Unauthorized Access Denied'
                    });
                }
            })
        } else {
            res.status(400).json({
                "message": "Email doesn't exist"
            }); // return wrong email
        }
    })
    .catch();
});

module.exports = router;