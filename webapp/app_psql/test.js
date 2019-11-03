var supertest = require("supertest");
//var should = require("should");
let chai = require('chai');
let chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:3000/v1");

// UNIT test begin

jest.mock('Model/user.js', () => () => {
    const SequelizeMock = require("sequelize-mock");
    const dbMock = new SequelizeMock();
    return dbMock.define('user',  {
        "first_name": "Anthony",
        "last_name": "Lawrence",
        "email": "Anthony3@gmail.com",
        "password": "Test@123"
    })
  });

  describe("Test Sequelize Mocking", () => {  
    it("Should get value from mock", async () => {
      const user = await UserDAO.getOneUser();
      expect(user.firstName).toEqual('good');
    })
  })

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