const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require("bcrypt");
const AWS = require('aws-sdk');
const Busboy = require('busboy');
const dotenv = require('dotenv');
dotenv.config();
const BUCKET_NAME = process.env.BUCKET_NAME
//'webapp.dev.ajaygoel.me';
// const IAM_USER_KEY = 'AKIA2XLRXCUPYQ4KMUHG';
// const IAM_USER_SECRET = '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';
const IAM_USER_KEY = process.env.DEV_ADMIN_IAM_USER_KEY;
const IAM_USER_SECRET = process.env.DEV_ADMIN_IAM_USER_SECRET;

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
            if (data.length <= 0) {
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
// ////POST

// router.post('/recipie', (req, res) => {

//     // check for basic auth header
//     if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
//         return res.status(401).json({
//             message: 'Missing Authorization Header'
//         });
//     }

//     // verify auth credentials
//     const base64Credentials = req.headers.authorization.split(' ')[1];
//     const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
//     const [email, password] = credentials.split(':');
//     //const result;

//     db.user.findAll({
//             where: {
//                 email: email
//             }
//         })
//         .then(data => {
//             console.log(data);
//             if (data.length <= 0) {
//                 return res.status(400).json({
//                     "message": "Email doesn't exist"
//                 }); // return wrong email
//             }
//             let user_authorized = false;
//             const author_id = data[0].id;
//             if (data[0] != undefined) {
//                 const db_password = data[0].password;
//                 bcrypt.compare(password, db_password, (err, result) => {

//                     //result= true;
//                     if (err) {
//                         res.status(400).json({
//                             message: 'Bad Request'
//                         });
//                     } else if (result) {

//                         const {
//                             title,
//                             cook_time_in_min,
//                             prep_time_in_min,
//                             cusine,
//                             servings,
//                             ingredients,
//                             steps,
//                             nutritionInformation,
//                             url
//                         } = req.body;

//                         const calories = nutritionInformation.calories;
//                         const cholesterol_in_mg = nutritionInformation.cholesterol_in_mg;
//                         const sodium_in_mg = nutritionInformation.sodium_in_mg;
//                         const carbohydrates_in_grams = nutritionInformation.carbohydrates_in_grams;
//                         const protein_in_grams = nutritionInformation.protein_in_grams;

//                         //console.log(nutritionInformation);
//                         const total_time_in_min = cook_time_in_min + prep_time_in_min;


//                         db.recipe.create({
//                                 author_id,
//                                 title,
//                                 cook_time_in_min,
//                                 prep_time_in_min,
//                                 total_time_in_min,
//                                 cusine,
//                                 servings,
//                                 ingredients,
//                                 steps,
//                                 "userId": author_id
//                             })
//                             .then(data => db.nutInfo.create({
//                                     "recipe_id": data.id,
//                                     calories,
//                                     cholesterol_in_mg,
//                                     sodium_in_mg,
//                                     carbohydrates_in_grams,
//                                     protein_in_grams,
//                                     "recipeId": data.id

//                                 })
//                                 .then(nutrition_information => db.recipeSteps.create({
//                                         "recipe_id": data.id,
//                                         steps,
//                                         "recipeId": data.id
//                                     })
//                                     .then(recipeSteps => db.image.create({
//                                             "recipe_id": data.id,
//                                             url,
//                                             "recipeId": data.id
//                                         })
//                                         .then(image_inserted => {
//                                             res.header("Content-Type", 'application/json');

//                                             res.status(200).send(JSON.stringify({
//                                                 "image": {
//                                                     "id": image_inserted.image_id,
//                                                     "url": image_inserted.url
//                                                 },
//                                                 "id": data.id,
//                                                 "created_ts": data.created_date,
//                                                 "updated_ts": data.updated_date,
//                                                 "author_id": data.author_id,
//                                                 "cook_time_in_min": data.cook_time_in_min,
//                                                 "prep_time_in_min": data.prep_time_in_min,
//                                                 "total_time_in_min": data.total_time_in_min,
//                                                 "title": data.title,
//                                                 "cusine": data.cusine,
//                                                 "servings": data.servings,
//                                                 "ingredients": data.ingredients,
//                                                 "steps": recipeSteps.steps,
//                                                 "nutrition_information": {
//                                                     "calories": nutrition_information.calories,
//                                                     "cholesterol_in_mg": nutrition_information.cholesterol_in_mg,
//                                                     "sodium_in_mg": nutrition_information.sodium_in_mg,
//                                                     "carbohydrates_in_grams": nutrition_information.carbohydrates_in_grams,
//                                                     "protein_in_grams": nutrition_information.protein_in_grams
//                                                 }
//                                             }));

//                                         })

//                                         // ));
//                                         //})
//                                     )
//                                 )
//                             )
//                             .catch(err => res.status(406).json({
//                                 message: err.message
//                             }));


//                     } else {
//                         res.status(401).json({
//                             message: 'Unauthorized Access Denied'
//                         });
//                     }
//                 })
//             } else {
//                 res.status(400).json({
//                     "message": "Email doesn't exist"
//                 }); // return wrong email
//             }
//         })
//         .catch();

// })

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
            if (data.length <= 0) {
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
                                                    .then(
                                                        deletedImage => {
                                                            db.image.destroy({
                                                                    where: {
                                                                        recipe_id: req.params.id
                                                                    }
                                                                })
                                                                .then(res.status(200).json({
                                                                    deletedRecipe
                                                                }))
                                                        }

                                                    )

                                            }
                                        )
                                } else {
                                    res.status(404).json({
                                        Message: "Not Found"
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

            if (data.length < 1) {
                return res.status(404).json({
                    message: 'Invalid Id'
                });

            } else {
                console.log(data.length);
                db.nutInfo.findAll({
                        where: {
                            recipe_id: req.params.id
                        }
                    })
                    .then(nutrition_information => {
                        db.image.findAll({

                                where: {
                                    recipe_id: req.params.id
                                }
                            })
                            .then(imageInformation => {
                                if (imageInformation.length > 0) {
                                    res.header("Content-Type", 'application/json');

                                    res.status(200).send(JSON.stringify(

                                        {
                                            "image": {
                                                "id": imageInformation[0].image_id,
                                                "url": imageInformation[0].url
                                            },
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
                                } else {
                                    res.header("Content-Type", 'application/json');

                                    res.status(200).send(JSON.stringify(

                                        {
                                            "image": "NO IMAGE PRESENT",
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
                                }

                            })
                    })
            }
        })

        .catch(err => res.status(406).json({
            message: err.message
        }));

});



// // PUT Recipe

// router.put('/recipie/:id', (req, res) => {

//     // check for basic auth header
//     if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
//         return res.status(401).json({
//             message: 'Missing Authorization Header'
//         });
//     }

//     // verify auth credentials
//     const base64Credentials = req.headers.authorization.split(' ')[1];
//     const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
//     const [email, password] = credentials.split(':');
//     //const result;

//     db.user.findAll({
//             where: {
//                 email: email
//             }
//         })
//         .then(data => {
//             console.log(data);
//             if (data.length <= 0) {
//                 return res.status(400).json({
//                     "message": "Email doesn't exist"
//                 }); // return wrong email
//             }

//             let user_authorized = false;
//             const author_id = data[0].id;

//             db.recipe.findAll({
//                     where: {
//                         id: req.params.id,
//                         author_id: author_id

//                     }
//                 })
//                 .then(data => {
//                     console.log(data);
//                     if (data.length <= 0) {
//                         return res.status(401).json({
//                             "message": "Unauthorized user for given recipe id"
//                         }); // return wrong email
//                     }
//                 });



//             if (data[0] != undefined) {

//                 const db_password = data[0].password;
//                 bcrypt.compare(password, db_password, (err, result) => {

//                     //result= true;
//                     if (err) {
//                         res.status(400).json({
//                             message: 'Bad Request'
//                         });
//                     } else if (result) {

//                         const {
//                             title,
//                             cook_time_in_min,
//                             prep_time_in_min,
//                             cusine,
//                             servings,
//                             ingredients,
//                             steps,
//                             nutritionInformation,
//                             url
//                         } = req.body;

//                         const calories = nutritionInformation.calories;
//                         const cholesterol_in_mg = nutritionInformation.cholesterol_in_mg;
//                         const sodium_in_mg = nutritionInformation.sodium_in_mg;
//                         const carbohydrates_in_grams = nutritionInformation.carbohydrates_in_grams;
//                         const protein_in_grams = nutritionInformation.protein_in_grams;

//                         //console.log(nutritionInformation);
//                         const total_time_in_min = cook_time_in_min + prep_time_in_min;
//                         db.recipe.update({
//                                 title: title,
//                                 cook_time_in_min: cook_time_in_min,
//                                 prep_time_in_min: prep_time_in_min,
//                                 total_time_in_min: total_time_in_min,
//                                 cusine: cusine,
//                                 servings: servings,
//                                 ingredients: ingredients,
//                                 steps: steps //,
//                                 // "userId": author_id
//                             }, {
//                                 returning: true,
//                                 where: {
//                                     id: req.params.id,
//                                     author_id: author_id
//                                 }
//                             })
//                             .then(function ([rowsUpdate, [data]]) {
//                                 //data => 
//                                 db.nutInfo.update({
//                                         //"recipe_id": data.id,
//                                         calories: calories,
//                                         cholesterol_in_mg: cholesterol_in_mg,
//                                         sodium_in_mg: sodium_in_mg,
//                                         carbohydrates_in_grams: carbohydrates_in_grams,
//                                         protein_in_grams: protein_in_grams,
//                                         //"recipeId": data.id
//                                     }, {
//                                         returning: true,
//                                         where: {
//                                             recipe_id: data.id
//                                         }
//                                     })
//                                     .then(function ([rowsUpdated, [nutrition_information]]) {
//                                         //nutrition_information => {
//                                         db.recipeSteps.update({
//                                                 steps: steps
//                                             }, {
//                                                 returning: true,
//                                                 where: {
//                                                     recipe_id: data.id
//                                                 }
//                                             })
//                                             .then(function ([rowsUpdated, [imageInformation]]) {
//                                                 db.image.update({
//                                                         url: url
//                                                     }, {
//                                                         returning: true,
//                                                         where: {
//                                                             recipe_id: data.id
//                                                         }
//                                                     })
//                                                     .then(function ([rowsUpdated, [imageInformation1]]) {
//                                                         res.header("Content-Type", 'application/json');
//                                                         res.status(200).send(JSON.stringify({
//                                                             "image": {
//                                                                 "id": imageInformation1.image_id,
//                                                                 "url": imageInformation1.url
//                                                             },
//                                                             "id": data.id,
//                                                             "created_ts": data.created_date,
//                                                             "updated_ts": data.updated_date,
//                                                             "author_id": data.author_id,
//                                                             "cook_time_in_min": data.cook_time_in_min,
//                                                             "prep_time_in_min": data.prep_time_in_min,
//                                                             "total_time_in_min": data.total_time_in_min,
//                                                             "title": data.title,
//                                                             "cusine": data.cusine,
//                                                             "servings": data.servings,
//                                                             "ingredients": data.ingredients,
//                                                             "steps": data.steps,
//                                                             "nutrition_information": {
//                                                                 "calories": nutrition_information.calories,
//                                                                 "cholesterol_in_mg": nutrition_information.cholesterol_in_mg,
//                                                                 "sodium_in_mg": nutrition_information.sodium_in_mg,
//                                                                 "carbohydrates_in_grams": nutrition_information.carbohydrates_in_grams,
//                                                                 "protein_in_grams": nutrition_information.protein_in_grams
//                                                             }
//                                                         }));
//                                                     })
//                                             })



//                                     })
//                             })
//                             .catch(err =>
//                                 res.status(401).json({
//                                     message: "Error " + err.message
//                                 })
//                             );


//                     } else {
//                         res.status(401).json({
//                             message: 'Unauthorized Access Denied'
//                         });
//                     }
//                 })

//             } else {
//                 res.status(400).json({
//                     "message": "Email doesn't exist"
//                 }); // return wrong email
//             }
//         })
//         .catch();

// })

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
            if (data.length <= 0) {
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
                    if (data.length <= 0) {
                        return res.status(401).json({
                            "message": "Unauthorized user for given recipe id"
                        }); // return wrong email
                    }
                });



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
                                    message: "Error " + err.message
                                })
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


// DELETE IMAGE
router.delete('/recipie/:id/image/:imageId', (req, res) => {

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
            if (data.length <= 0) {
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

                        db.recipe.findAll({
                                where: {
                                    id: req.params.id,
                                    author_id: author_id

                                }
                            })
                            .then(data => {
                                console.log(data);
                                if (data.length <= 0) {
                                    return res.status(401).json({
                                        "message": "Unauthorized user for given recipe id"
                                    }); // return wrong email
                                }
                            });

                        db.image.findAll({
                                where: {
                                    recipe_id: req.params.id
                                }
                            })
                            .then(image_data => {
                                if (image_data.length > 0) {

                                    if (image_data[0].image_id != req.params.imageId) {
                                        res.status(404).json({
                                            message: "No Image Id Found"
                                        })
                                    } else {
                                        var k = '';

                                        db.image.findAll({
                                                where: {
                                                    recipe_id: req.params.id
                                                }
                                            })
                                            .then(image_data => {
                                                //if (image_data.length > 0) {
                                                //k=image_data[0].S3Key;
                                                //res.status(200).json({
                                                //console.log(image_data[0]);
                                                //console.log('here');
                                                //k = 
                                                console.log(image_data[0].S3Key)
                                                let s3bucket = new AWS.S3({
                                                    accessKeyId: IAM_USER_KEY,
                                                    secretAccessKey: IAM_USER_SECRET,
                                                    Bucket: BUCKET_NAME
                                                });
                                                s3bucket.deleteObject({
                                                    Bucket: BUCKET_NAME,
                                                    Key: image_data[0].S3Key
                                                }, function (err, data) {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                    console.log(data);
                                                    db.image.destroy({
                                                            where: {
                                                                recipe_id: req.params.id
                                                            }
                                                        })
                                                        .then(deletedImage => {

                                                            //                                                console.log(deletedRecipe[0])
                                                            if (deletedImage > 0) {
                                                                // let s3bucket = new AWS.S3({
                                                                //     accessKeyId: IAM_USER_KEY,
                                                                //     secretAccessKey: IAM_USER_SECRET,
                                                                //     Bucket: BUCKET_NAME
                                                                // });
                                                                // s3bucket.deleteObject({
                                                                //     Bucket: BUCKET_NAME,
                                                                //     //Location: deletedImage.url //.name//,
                                                                //     Key: deletedImage[0].S3Key//file.data
                                                                // }, function (err, data) {
                                                                //     if (err) {
                                                                //         console.log(err);
                                                                //     }
                                                                //     console.log(data);
                                                                // })
                                                                res.status(200).json({
                                                                    deletedImage
                                                                })
                                                            } else {
                                                                res.status(404).json({
                                                                    Message: "Not Found"
                                                                })
                                                            }
                                                        })
                                                })

                                                //})
                                                //    }
                                            })
                                        console.log("----->>>>" + k)

                                    }
                                } else {
                                    //if(image_data[0].recipe_id!=req.params.id){
                                    res.status(204).json({
                                        message: "No Content for this recipe ID"
                                    })
                                    //}

                                }
                            })
                            .catch(err => res.status(406).json({
                                message: err.message,
                                //message: "No recipe ID found"
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

var image_s3_url = "HIIIII";

function uploadToS3(file) {
    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        Bucket: BUCKET_NAME
    });
    s3bucket.createBucket(function () {
        var params = {
            Bucket: BUCKET_NAME,
            Key: file.name,
            Body: file.data
        };
        s3bucket.upload(params, function (err, data) {
            if (err) {
                console.log('error in callback');
                console.log(err);
            }
            console.log('success' + '--------------->>>>>');
            console.log(data);
            image_s3_url = data.Location;
            console.log(image_s3_url + '--------------------------->>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<')
        });
    });
}


var count = 0;

////POST
router.post('/recipie/:id/image', (req, res) => {
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
            if (data.length <= 0) {
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

                        db.recipe.findAll({
                                where: {
                                    id: req.params.id,
                                    author_id: author_id

                                }
                            })
                            .then(data => {
                                console.log(data);
                                if (data.length <= 0) {
                                    return res.status(401).json({
                                        "message": "Unauthorized user for given recipe id"
                                    }); // return wrong email
                                }
                            });


                        if (req.files.element2 == undefined) {
                            res.header("Content-Type", 'application/json');
                            res.status(400).send(JSON.stringify({
                                "Message": "Please upload an image in form data"
                            }))
                        } else {


                            const file2 = req.files.element2;
                            console.log(file2.name + "--=-=-=-=-=-=-=-=-=-=-=-");

                            var words = file2.name.split('.');
                            console.log(words[1] + "--=-=-=-=-=-=-=-=-=-=-=-");
                            if (words[1] != 'jpg' && words[1] != 'jpeg' && words[1] != 'png') {
                                res.header("Content-Type", 'application/json');
                                res.status(406).send(JSON.stringify({
                                    "Message": "File type should be image"
                                }))
                            } else {
                                db.image.findAll({
                                        where: {
                                            recipe_id: req.params.id
                                        }
                                    })
                                    .then(data => {
                                        if (data[0] == undefined) {


                                            var busboy = new Busboy({
                                                headers: req.headers
                                            });
                                            console.log("here");
                                            // The file upload has completed
                                            busboy.on('finish', function () {
                                                console.log('Upload finished');
                                                const file = req.files.element2;
                                                console.log(file);

                                                // Begins the upload to the AWS S3
                                                //uploadToS3(file);
                                                //setTimeout(function2, 5000000);
                                                let s3bucket = new AWS.S3({
                                                    accessKeyId: IAM_USER_KEY,
                                                    secretAccessKey: IAM_USER_SECRET,
                                                    Bucket: BUCKET_NAME
                                                });
                                                s3bucket.createBucket(function () {
                                                    var params = {
                                                        Bucket: BUCKET_NAME,
                                                        Key: new Date() + file.name, //file.name,
                                                        Body: file.data
                                                    };
                                                    count++;
                                                    s3bucket.upload(params, function (err, data) {
                                                        if (err) {
                                                            console.log('error in callback');
                                                            console.log(err);
                                                        }
                                                        console.log('success' + '--------------->>>>>');
                                                        //console.log(data);
                                                        image_s3_url = data.Location;
                                                        var r = '';
                                                        console.log(image_s3_url + '--------------------------->>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<')
                                                        s3bucket.getObject({
                                                            Bucket: BUCKET_NAME,
                                                            Key: data.key
                                                        }).on('success', function (response) {
                                                            console.log("Key was", response.request.params.Key);
                                                            console.log(response.httpResponse.headers);
                                                            db.image.create({
                                                                    "recipe_id": req.params.id,
                                                                    "url": image_s3_url,
                                                                    "S3Key": data.Key,
                                                                    "recipeId": req.params.id,
                                                                    "metadata": response.httpResponse.headers
                                                                })
                                                                .then(imageData => {
                                                                    res.header("Content-Type", 'application/json');
                                                                    res.status(201).send(JSON.stringify({
                                                                        "id": imageData.image_id,
                                                                        "url": imageData.url
                                                                    }))
                                                                })
                                                        }).send();

                                                        // db.image.create({
                                                        //         "recipe_id": req.params.id,
                                                        //         "url": image_s3_url,
                                                        //         "S3Key": data.Key,
                                                        //         "recipeId": req.params.id
                                                        //     })
                                                        //     .then(imageData => {
                                                        //         res.header("Content-Type", 'application/json');
                                                        //         res.status(201).send(JSON.stringify({
                                                        //             "id": imageData.image_id,
                                                        //             "url": imageData.url
                                                        //         }))
                                                        //     })
                                                        res.status(201);
                                                    });
                                                });
                                            });

                                            req.pipe(busboy);

                                            console.log(image_s3_url + "==================")
                                            // db.image.create({
                                            //         "recipe_id": req.params.id,
                                            //         "url":image_s3_url,
                                            //         "recipeId": req.params.id
                                            //     })
                                            //     .then(imageData => {
                                            //         res.header("Content-Type", 'application/json');
                                            //         res.status(201).send(JSON.stringify({
                                            //             "id": imageData.image_id,
                                            //             "url": imageData.url
                                            //         }))
                                            //     })
                                            // res.status(201);

                                        } else {
                                            res.header("Content-Type", 'application/json');
                                            res.status(400).send(JSON.stringify({
                                                "Result": "Delete the Image first before posting a new image."
                                            }));
                                        }
                                    })
                                    .catch(err => res.status(406).json({
                                        message: err.message
                                    }));

                            }
                        }
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



//// Get IMAGE by recipe id and image id 

router.get('/recipie/:id/image/:imageId', (req, res) => {
    db.image.findAll({
            where: {
                recipe_id: req.params.id
            }
        })
        .then(image_data => {
            if (image_data.length > 0) {

                if (image_data[0].image_id != req.params.imageId) {
                    res.status(404).json({
                        message: "No Image Id Found"
                    })
                } else {
                    res.header("Content-Type", 'application/json');
                    res.status(200).send(JSON.stringify({
                        "id": image_data[0].image_id,
                        "url": image_data[0].url
                    }));

                }
            } else {
                //if(image_data[0].recipe_id!=req.params.id){
                res.status(404).json({
                    message: "No Recipe ID found"
                })
                //}

            }
        })
        .catch(err => res.status(406).json({
            message: err.message,
        }));

});

//// Get by latest recipe ID

router.get('/recipies', (req, res) => {
    //db.recipe.max('created_date')
    //db.recipe.query(,{type:})
    db.recipe.findAll({
            limit: 10,
            order: [
                ['created_date', 'DESC']
            ]
        })
        .then(data => {
            if (data.length < 1) {
                return res.status(404).json({
                    message: 'No data present'
                });

            } else {
                //console.log(data.length);
                // res.status(200).send(JSON.stringify(
                //     {
                //         "message":data[0]
                //     }
                // ))
                const recipeID = data[0].id;
                db.nutInfo.findAll({
                        where: {
                            recipe_id: recipeID
                        }
                    })
                    .then(nutrition_information => {
                        db.image.findAll({

                                where: {
                                    recipe_id: recipeID
                                }
                            })
                            .then(imageInformation => {
                                if (imageInformation.length > 0) {
                                    res.header("Content-Type", 'application/json');

                                    res.status(200).send(JSON.stringify(

                                        {
                                            "image": {
                                                "id": imageInformation[0].image_id,
                                                "url": imageInformation[0].url
                                            },
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
                                } else {
                                    res.header("Content-Type", 'application/json');

                                    res.status(200).send(JSON.stringify(

                                        {
                                            "image": "NO IMAGE PRESENT",
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
                                }

                            })
                    })
            }
        })
        .catch(err => res.status(406).json({
            message: err.message
        }));
});