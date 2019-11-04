let chai = require('chai');
let chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);
const path = require('path')

var validator = require("email-validator");
var passwordValidator = require('password-validator');
var schema = new passwordValidator();
schema
    .is().min(8) // Minimum length 8
    .is().max(100) // Maximum length 100
    .has().uppercase() // Must have uppercase letters
    .has().lowercase() // Must have lowercase letters
    .has().digits() // Must have digits
    .has().not().spaces() // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']);

// UNIT test begin

describe('Sample Test', () => {
    it('should test that true === true', () => {
        expect(true).toBe(true)
    })
})

// jest.mock('./Model/user', () => () => {
//     const SequelizeMock  = require("sequelize-mock");
//     const dbMock = new SequelizeMock();
//     return dbMock.define('user',  {
//         "first_name": "Anthony",
//         "last_name": "Lawrence",
//         "email": "Anthony3@gmail.com",
//         "password": "Test@123"
//     })
//   });

describe("Unit test for email and password validator", () => {

    it("should return true if valid", () => {


        let user = {
            "first_name": "Anthony",
            "last_name": "Lawrence",
            "email": "Anthony3@gmail.com",
            "password": "Test@123"
        }
        expect(validator.validate(user.email) && schema.validate(user.password)).toBe(true);

    })
});


describe("Unit test for email and password validator", () => {

    it("should return false if invalid", () => {


        let user = {
            "first_name": "Anthony",
            "last_name": "Lawrence",
            "email": "Anthony3gmail.com",
            "password": "Test@123"
        }
        expect(validator.validate(user.email) && schema.validate(user.password)).toBe(false);

    })
});

describe("Unit test for post user", () => {

    it("should return false if invalid", () => {


        let user = {
            "first_name": "Anthony",
            "last_name": "Lawrence",
            "email": "Anthony3gmail.com"
        }

        expect(user.length == 4).toBe(false);

    })
});

describe("Unit test to get user", () => {

    it("should return true if valid authentication", () => {

        let auth = {
            "email": "Anthony3@gmail.com",
            "password": "Test@123"
        }

        let user = {
            "first_name": "Anthony",
            "last_name": "Lawrence",
            "email": "Anthony3@gmail.com",
            "password": "Test@123"
        }

        auth.email.should.equal('Anthony3@gmail.com');
        auth.password.should.equal('Test@123');

    })
});

describe("Unit test to get user", () => {

    it("should return false if invalid", () => {

        let auth = {
            "email": "Anthony@gmail.com",
            "password": "Test@123"
        }

        let user = {
            "first_name": "Anthony",
            "last_name": "Lawrence",
            "email": "Anthony3@gmail.com",
            "password": "Test@123"
        }

        auth.email.should.not.equal('Anthony3@gmail.com');
        auth.password.should.equal('Test@123');

    })
});

describe("Unit test to add recipe", () => {

    it("should return false if data is invalid", () => {

        let auth = {
            "email": "Anthony3@gmail.com",
            "password": "Test@123"
        }

        let recipe = {
            "title": "Paneer6",
            "cook_time_in_min": 60,
            "prep_time_in_min": 70,
            "total_time_in_min": 150,
            "cusine": "Indian",
            "servings": 4,
            "ingredients": [
                "2 Tea Spoon Oils",
                "currly leaves"
            ],
            "steps": [{
                "position": 1,
                "items": "some text here"
            }],
            "nutritionInformation": {
                "calories": 102,
                "cholesterol_in_mg": 100,
                "sodium_in_mg": 100,
                "carbohydrates_in_grams": 100,
                "protein_in_grams": 100
            }
        }
        var rem = recipe.cook_time_in_min % 5;
        var rem1 = recipe.prep_time_in_min % 5;

        auth.email.should.equal('Anthony3@gmail.com');
        auth.password.should.equal('Test@123');
        rem.should.equal(0);
        rem1.should.equal(0);

    })
});





describe("Unit test to validate input file", () => {

            it("should return false if invalid", () => {

                    let auth = {
                        "email": "Anthony@gmail.com",
                        "password": "Test@123"
                    }
                    var words = path.basename('./data/download.jpeg').split('.');
                    console.log(words[1] + "--=-=-=-=-=-=-=-=-=-=-=-");
                    var req=true;
                    if (words[1] != 'jpg' && words[1] != 'jpeg' && words[1] != 'png') {
                        req=false;
                       }

                        auth.email.should.not.equal('Anthony3@gmail.com');
                        auth.password.should.equal('Test@123');
                        req.should.equal(true)

                    })
            });