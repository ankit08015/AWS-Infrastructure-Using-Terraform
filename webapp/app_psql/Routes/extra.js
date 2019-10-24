const express = require('express');
const router = express.Router();
const db = require('../config/database');
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

    db.user.findAll({
            where: {
                email: email
            }
        })
        .then(data => {
            console.log(data);
            if(data.length<=0){
                return res.status(400).json({
                    "message": "Email doesn't exist"
                }); // return wrong email
            }
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
                            ingredients,
                            steps,
                            nutritionInformation
                        } = req.body;

                        const calories = nutritionInformation.calories;
                        const cholesterol_in_mg = nutritionInformation.cholesterol_in_mg;
                        const sodium_in_mg = nutritionInformation.sodium_in_mg;
                        const carbohydrates_in_grams = nutritionInformation.carbohydrates_in_grams;
                        const protein_in_grams = nutritionInformation.protein_in_grams;

                        //console.log(nutritionInformation);
                        const total_time_in_min = cook_time_in_min + prep_time_in_min;


                        db.recipe.create({
                                author_id,
                                title,
                                cook_time_in_min,
                                prep_time_in_min,
                                total_time_in_min,
                                cusine,
                                servings,
                                ingredients,
                                steps,
                                "userId": author_id
                            })
                            .then(data => db.nutInfo.create({
                                    "recipe_id": data.id,
                                    calories,
                                    cholesterol_in_mg,
                                    sodium_in_mg,
                                    carbohydrates_in_grams,
                                    protein_in_grams,
                                    "recipeId": data.id

                                })
                                .then(nutrition_information => db.recipeSteps.create({
                                        "recipe_id": data.id,
                                        steps,
                                        "recipeId": data.id
                                    })
                                    .then(recipeSteps => {
                                        res.header("Content-Type", 'application/json');

                                        res.status(200).send(JSON.stringify(

                                            {
                                                "id": data.id,
                                                "created_ts": data.created_date,
                                                "updated_ts": data.updated_date,
                                                "author_id": data.author_id,
                                                "cook_time_in_min": data.cook_time_in_min,
                                                "prep_time_in_min": data.prep_time_in_min,
                                                "total_time_in_min": data.total_time_in_min,
                                                "title": data.title,
                                                "cusine": data.cusine,
                                                "servings": data.servings,
                                                "ingredients": data.ingredients,
                                                "steps": recipeSteps.steps,
                                                "nutrition_information": {
                                                    "calories": nutrition_information.calories,
                                                    "cholesterol_in_mg": nutrition_information.cholesterol_in_mg,
                                                    "sodium_in_mg": nutrition_information.sodium_in_mg,
                                                    "carbohydrates_in_grams": nutrition_information.carbohydrates_in_grams,
                                                    "protein_in_grams": nutrition_information.protein_in_grams
                                                }
                                            }
                                        ));
                                    }))
                            )
                            .catch(err => res.status(406).json({
                                message: err.message
                            }));


                    } else {
                        res.status(401).json({
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
////// DELETE

router.delete('/recipie/:id', (req, res) => {

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


    db.user.findAll({
            where: {
                email: email
            }
        })
        .then(data => {
            console.log(data);
            if(data.length<=0){
                return res.status(400).json({
                    "message": "Email doesn't exist"
                }); // return wrong email
            }
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

                        db.recipe.destroy({
                                where: {
                                    id: req.params.id,
                                    author_id: author_id
                                }
                            })
                            // TODO-- delete nutrition also
                            .then(deletedRecipe => {
                                if (deletedRecipe > 0) {
                                    db.nutInfo.destroy({
                                        where: {
                                            recipe_id: req.params.id
                                        }
                                    })
                                    .then(
                                        deletedRecipeSteps => {
                                            db.recipeSteps.destroy({
                                                    where: {
                                                        recipe_id: req.params.id
                                                    }
                                                })
                                                .then(res.status(200).json({
                                                    deletedRecipe
                                                }))
                                        }
                                    )
                                } else {
                                    res.status(400).json({
                                        Message: "Bad Request"
                                    })
                                }

                            })
                            .catch(err => res.status(406).json({
                                message: err.message
                            }));
                    } else {
                        res.status(401).json({
                            message: 'Unauthorized Access Denied'
                        });
                    }
                })
            } else {
                res.status(404).json({
                    "message": "Email doesn't exist"
                }); // return wrong email
            }
        })
        .catch(

        );
});


module.exports = router;


//// Get by ID

router.get('/recipie/:id', (req, res) => {
    db.recipe.findAll({
            where: {
                id: req.params.id
            }
        })
        .then(data => {

            if(data.length<1){
                return res.status(404).json({
                    message: 'Invalid Id'
                });
                
            }
            else{
            console.log(data.length);
            db.nutInfo.findAll({
                    where: {
                        recipe_id: req.params.id
                    }
                })
                .then(nutrition_information => {
                    res.header("Content-Type", 'application/json');

                    res.status(200).send(JSON.stringify(

                        {
                            "id": data[0].id,
                            "created_ts": data[0].created_date,
                            "updated_ts": data[0].updated_date,
                            "author_id": data[0].author_id,
                            "cook_time_in_min": data[0].cook_time_in_min,
                            "prep_time_in_min": data[0].prep_time_in_min,
                            "total_time_in_min": data[0].total_time_in_min,
                            "title": data[0].title,
                            "cusine": data[0].cusine,
                            "servings": data[0].servings,
                            "ingredients": data[0].ingredients,
                            "steps": data[0].steps,
                            "nutrition_information": {
                                "calories": nutrition_information[0].calories,
                                "cholesterol_in_mg": nutrition_information[0].cholesterol_in_mg,
                                "sodium_in_mg": nutrition_information[0].sodium_in_mg,
                                "carbohydrates_in_grams": nutrition_information[0].carbohydrates_in_grams,
                                "protein_in_grams": nutrition_information[0].protein_in_grams
                            }
                        }
                    ));
                })
        }})

        .catch(err => res.status(406).json({
            message: err.message
        }));

});



// PUT Recipe

router.put('/recipie/:id', (req, res) => {

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

    db.user.findAll({
            where: {
                email: email
            }
        })
        .then(data => {
            console.log(data);
            if(data.length<=0){
                return res.status(400).json({
                    "message": "Email doesn't exist"
                }); // return wrong email
            }

            let user_authorized = false;
            const author_id = data[0].id;

            db.recipe.findAll({
                where: {
                    id: req.params.id,
                    author_id: author_id

                }
            })
            .then(data => {
                console.log(data);
                if(data.length<=0){
                    return res.status(401).json({
                        "message": "Unauthorized user for given recipe id"
                    }); // return wrong email
                }});


            
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
                            ingredients,
                            steps,
                            nutritionInformation
                        } = req.body;

                        const calories = nutritionInformation.calories;
                        const cholesterol_in_mg = nutritionInformation.cholesterol_in_mg;
                        const sodium_in_mg = nutritionInformation.sodium_in_mg;
                        const carbohydrates_in_grams = nutritionInformation.carbohydrates_in_grams;
                        const protein_in_grams = nutritionInformation.protein_in_grams;

                        //console.log(nutritionInformation);
                        const total_time_in_min = cook_time_in_min + prep_time_in_min;
                        db.recipe.update({
                                title: title,
                                cook_time_in_min: cook_time_in_min,
                                prep_time_in_min: prep_time_in_min,
                                total_time_in_min: total_time_in_min,
                                cusine: cusine,
                                servings: servings,
                                ingredients: ingredients,
                                steps: steps //,
                                // "userId": author_id
                            }, {
                                returning: true,
                                where: {
                                    id: req.params.id,
                                    author_id: author_id
                                }
                            })
                            .then(function ([rowsUpdate, [data]]) {
                                //data => 
                                db.nutInfo.update({
                                        //"recipe_id": data.id,
                                        calories: calories,
                                        cholesterol_in_mg: cholesterol_in_mg,
                                        sodium_in_mg: sodium_in_mg,
                                        carbohydrates_in_grams: carbohydrates_in_grams,
                                        protein_in_grams: protein_in_grams,
                                        //"recipeId": data.id
                                    }, {
                                        returning: true,
                                        where: {
                                            recipe_id: data.id
                                        }
                                    })
                                    .then(function ([rowsUpdated, [nutrition_information]]) {
                                        //nutrition_information => {
                                        db.recipeSteps.update({
                                                steps: steps
                                            }, {
                                                returning: true,
                                                where: {
                                                    recipe_id: data.id
                                                }
                                            })
                                            .then(function ([rowsUpdated, [nutrition_information1]]) {
                                                res.header("Content-Type", 'application/json');

                                                res.status(200).send(JSON.stringify(

                                                    {
                                                        "id": data.id,
                                                        "created_ts": data.created_date,
                                                        "updated_ts": data.updated_date,
                                                        "author_id": data.author_id,
                                                        "cook_time_in_min": data.cook_time_in_min,
                                                        "prep_time_in_min": data.prep_time_in_min,
                                                        "total_time_in_min": data.total_time_in_min,
                                                        "title": data.title,
                                                        "cusine": data.cusine,
                                                        "servings": data.servings,
                                                        "ingredients": data.ingredients,
                                                        "steps": data.steps,
                                                        "nutrition_information": {
                                                            "calories": nutrition_information.calories,
                                                            "cholesterol_in_mg": nutrition_information.cholesterol_in_mg,
                                                            "sodium_in_mg": nutrition_information.sodium_in_mg,
                                                            "carbohydrates_in_grams": nutrition_information.carbohydrates_in_grams,
                                                            "protein_in_grams": nutrition_information.protein_in_grams
                                                        }
                                                    }
                                                ));
                                            })



                                    })
                            })
                            .catch(err => 
                                res.status(401).json({
                                message: "Error " + err.message})
                            );


                    } else {
                        res.status(401).json({
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


module.exports = router;