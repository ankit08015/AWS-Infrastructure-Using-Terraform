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
                "email": "Anthony@gmail.com",
                "password": "Test@123"
            })
            .end(function (err, res) {
                (res).should.have.status(201);
                (res).should.be.json;
                (res).body.should.have.property('message');
                (res).body.details.first_name.should.equal('Anthony');
                (res).body.details.last_name.should.equal('Lawrence');
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
            .auth('Anthony@gmail.com', 'Test@123')
            .end(function (err, res) {
                if (!err) {
                    (res).should.have.status(200);
                    (res.body[0]).should.be.a('object');
                    (res.body.length).should.be.eq(1);
                    (res).body[0].first_name.should.equal('Anthony');
                    (res).body[0].last_name.should.equal('Lawrence');
                    done();
                }
            })
    });

});


describe("Unit test for Updating an user", function () {

    it("Should return Data of the updated user", function (done) {
        server
            .put("/user/self")
            .auth('Anthony@gmail.com', 'Test@123')
            .send({
                "first_name": "Anthony_update",
                "last_name": "Lawrence_update",
                "password": "Test@123"
            })
            .end(function (err, res) {
                (res).should.have.status(200);
                (res).should.be.json;
                (res).body.should.have.property('message');
                done();
            })
        //.catch((err) => done(err));
    });

});