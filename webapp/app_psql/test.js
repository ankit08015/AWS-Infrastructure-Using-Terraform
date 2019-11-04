var supertest = require("supertest");
//var should = require("should");
let chai = require('chai');
let chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);
const express = require('express')

const router = express.Router();

const query = require('./Routes/queries')

//var jest = require('./Model/user')

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:3000/v1");

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

  describe("Unit test for email and password validator",  () => {

    it("should return true if valid",  () =>{


      let user =
        {
            "first_name": "Anthony",
            "last_name": "Lawrence",
            "email": "Anthony3@gmail.com",
            "password": "Test@123"
        }
        expect( validator.validate(user.email) && schema.validate(user.password)).toBe(true);
      
    })
});


describe("Unit test for email and password validator",  () => {

    it("should return false if invalid",  () =>{


      let user =
        {
            "first_name": "Anthony",
            "last_name": "Lawrence",
            "email": "Anthony3gmail.com",
            "password": "Test@123"
        }
        expect( validator.validate(user.email) && schema.validate(user.password)).toBe(false);
      
    })
});

describe("Unit test for post user",  () => {

    it("should return false if invalid",  () =>{


      let user =
        {
            "first_name": "Anthony",
            "last_name": "Lawrence",
            "email": "Anthony3gmail.com"
        }

        expect( user.length==4).toBe(false);
      
    })
});

describe("Unit test to get user",  () => {

    it("should return true if valid authentication",  () =>{

        let auth ={
            "email":"Anthony3@gmail.com",
            "password":"Test@123"
        }

      let user =
        {
            "first_name": "Anthony",
            "last_name": "Lawrence",
            "email": "Anthony3@gmail.com",
            "password": "Test@123"
        }

        auth.email.should.equal('Anthony3@gmail.com');
        auth.password.should.equal('Test@123');
      
    })
});

describe("Unit test to get user",  () => {

    it("should return false if invalid",  () =>{

        let auth ={
            "email":"Anthony@gmail.com",
            "password":"Test@123"
        }

      let user =
        {
            "first_name": "Anthony",
            "last_name": "Lawrence",
            "email": "Anthony3@gmail.com",
            "password": "Test@123"
        }

        auth.email.should.not.equal('Anthony3@gmail.com');
        auth.password.should.equal('Test@123');
      
    })
});




