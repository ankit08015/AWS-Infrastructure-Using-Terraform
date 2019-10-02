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
                "email": "Anthony17@gmail.com",
                "password": "Test@123"
            })
            .end(function (err, res) {
                (res).should.have.status(200);
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
            .auth('Anthony17@gmail.com', 'Test@123')
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
            .auth('Anthony17@gmail.com', 'Test@123')
            .send({
                "first_name": "Anthony2",
                "last_name": "Lawrence2",
                "password": "Test@123"
            })
            .end(function (err, res) {
                console.log(res);
                (res).should.have.status(200);
                (res).should.be.json;
                (res).body.first_name.should.equal('Anthony2');
                (res).body.should.have.property('created_date');
                done();
            })
        //.catch((err) => done(err));
    });

});