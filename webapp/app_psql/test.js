var supertest = require("supertest");
//var should = require("should");
let chai = require('chai');
let chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:3000/v1");

// UNIT test begin


describe("Unit test for Posting an user", function () {

    it("should return Data of the created user", function (done) {

        server
            .post("/user")
            .send({
                "first_name": "Anthony",
                "last_name": "Lawrence",
                "email": "Anthony3@gmail.com",
                "password": "Test@123"
            })
            .end(function (err, res) {
                (res).should.have.status(201);
                done();
            })
        //.catch((err) => done(err));
    });
});

describe("Unit test for Getting a user", function () {

    // #1 should return home page

    it("should return Data of a specific user", function (done) {

        // calling home page api
        server
            .get("/user/self")
            .auth('Anthony3@gmail.com', 'Test@123')
            .end(function (err, res) {
                if (!err) {
                    //console.log(res);
                    (res).should.have.status(200);
                    (res.body).should.be.a('object');
                    (res).body.first_name.should.equal('Anthony');
                    (res).body.last_name.should.equal('Lawrence');
                    done();
                }
            })
    });

});


describe("Unit test for Updating an user", function () {

    it("Should return Data of the updated user", function (done) {
        server
            .put("/user/self")
            .auth('Anthony3@gmail.com', 'Test@123')
            .send({
                "first_name": "Anthony3",
                "last_name": "Lawrence2",
                "password": "Test@123"
            })
            .end(function (err, res) {
                console.log(res);
                (res).should.have.status(200);
                (res).should.be.json;
                (res).body.first_name.should.equal('Anthony3');
                (res).body.should.have.property('created_date');
                done();
            })
        //.catch((err) => done(err));
    });

});


let id = require('uuid/v4');

describe("Unit test for Posting a recepie", function () {

    it("should return Data of the created recepie", function (done) {

        server
            .auth('Anthony3@gmail.com', 'Test@123')
            .post("/recipie")
            .send({
                "title": "Paneer Tikka",
                "cook_time_in_min": 15,
                "prep_time_in_min": 10,
                "total_time_in_min": 15,
                "cusine": "Indian",
                "ingredients": [
                    "Paneer",
                    "Musturd seeds"
                ],
                "servings": 3,
                "steps": [{
                        "position": 1,
                        "item": "Open frozen packet and heat it for 3 mins"
                    },
                    {
                        "position": 2,
                        "item": "Open frozen packet and heat it for 3 mins"
                    }
                ],
                "nutritionInformation": {
                    "calories": 70,
                    "cholesterol_in_mg": 55.5,
                    "sodium_in_mg": 80,
                    "carbohydrates_in_grams": 150,
                    "protein_in_grams": 7
                }

            })
            .end(function (err, res) {
                (res).should.have.status(200);
                res.body.title.should.equal('Paneer Tikka');
                res.body.steps[0].item.should.equal('Open frozen packet and heat it for 3 mins');
                res.body.nutrition_information.calories.should.equal(70);

                id = (res).body.id;
                //console.log(id);
                done();
            })
    });
});

//const id2 = id;
//GET
describe("Unit test for Getting a recipie of a user", function () {

    // #1 should return home page

    it("should return Data of a specific recipe of a user", function (done) {

        // calling home page api
        server
            .get("/recipie/"+id)
            .auth('Anthony3@gmail.com', 'Test@123')
            .end(function (err, res) {
                if (!err) {
                    (res).should.have.status(200);
                    (res).body.title.should.equal('Paneer Tikka');
                    //(res).body.steps.position.equal(1);
                    console.log(res.body);
                    (res).body.steps[0].item.should.equal('Open frozen packet and heat it for 3 mins')
                    res.body.nutrition_information.calories.should.equal(70);
                    //id = res.body.id;
                    done();
                }
            })
    });
});

//update
// describe("Unit test for Updating a recepie of a user", function () {
//     //console.log(str(id));
//     it("Should return Data of the updated recepie", function (done) {
//         server
//             .put("/recipie/2b2be7cb-e0f8-477e-9235-45241bf450a6")
//             .auth('Anthony3@gmail.com', 'Test@123')
//             .send({
//                 "title": "Paneer Tikka",
//                 "cook_time_in_min": 35,
//                 "prep_time_in_min": 10,
//                 "total_time_in_min": 15,
//                 "cusine": "Indian",
//                 "ingredients": [
//                                 "Paneer",
//                                 "Musturd seeds",
//                                 "Yogurt"
//                                ],
//                 "servings": 3,
//                 "steps": [
//                             {
//                                "position": 1,
//                                "item": "Open frozen packet and heat it for 3 mins"
//                             },
//                             {
//                                "position": 2,
//                                "item": "Open frozen packet and heat it for 3 mins"
//                             }
//                         ],
//                 "nutritionInformation": {
//                             "calories": 700,
//                             "cholesterol_in_mg": 55.5,
//                             "sodium_in_mg": 80,
//                             "carbohydrates_in_grams": 150,
//                             "protein_in_grams": 7
//                         }
//             })

//             .end(function (err, res) {
//                 if (!err) {
//                     (res).should.have.status(200);
//                     ///(res).body.title.should.equal('Paneer Tikka');
//                     //(res).body.steps.position.equal(1);
//                     console.log(res.body);
//                     //(res).body.steps[0].item.should.equal('Open frozen packet and heat it for 3 mins')
//                     //res.body.nutrition_information.calories.should.equal(70);
//                     //id = res.body.id;
//                     done();
//                 }
//             })
//     });

// });


describe("Unit test for updating a recepie", function () {

    it("should return Data of the updated recepie", function (done) {

        server
            .auth('Anthony3@gmail.com', 'Test@123')
            .put("/recipie/"+id)
            .send({
                "title": "Paneer",
                "cook_time_in_min": 15,
                "prep_time_in_min": 10,
                "total_time_in_min": 15,
                "cusine": "Indian",
                "ingredients": [
                    "Paneer",
                    "Musturd seeds"
                ],
                "servings": 3,
                "steps": [{
                    "position": 1,
                    "item": "Open frozen packet and heat it for 3 mins"
                }],
                "nutritionInformation": {
                    "calories": 700,
                    "cholesterol_in_mg": 55.5,
                    "sodium_in_mg": 80,
                    "carbohydrates_in_grams": 150,
                    "protein_in_grams": 7
                }
            })
            .end(function (err, res) {
                console.log(res.body);
                (res).should.have.status(200);
                res.body.title.should.equal('Paneer');
                //res.body.steps[0].item.should.equal('Open frozen packet and heat it for 3 mins');
                res.body.nutrition_information.calories.should.equal(700);
                done();
            })
    });
});



describe("Unit test for deleting a recepie", function () {

    it("should return deleted recipe =1 ", function (done) {

        server
            .auth('Anthony3@gmail.com', 'Test@123')
            .delete("/recipie/"+id)
            .end(function (err, res) {
                console.log(res.body);
                (res).should.have.status(200);
                res.body.deletedRecipe.should.equal(1);
                //res.body.steps[0].item.should.equal('Open frozen packet and heat it for 3 mins');
                //res.body.nutrition_information.calories.should.equal(700);
                done();
            })
    });
});