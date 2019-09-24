var supertest = require("supertest");
//var should = require("should");
let chai = require('chai');
let chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:3000/vi/user");

// UNIT test begin

describe("Unit test for Getting a user", function () {

    // #1 should return home page

    it("should return Data of a specific user", function (done) {

        // calling home page api
        server
            .get("/self")
            .auth('Yagnik2@gmail.com', 'Test@13')
            //.expect(200) // THis is HTTP response
            //.expect(body.to.contain.property('id'))
            //.send({name :'Ajay'})
            .end(function (err, res) {
                //if(!err){
                    // HTTP status should be 200
                    // var r = res.status;
                    // if (r==200)
                    //     res.status.should.equal(200);
                    // Error key should be false.
                    // else {
                    //     res.body.error.equal(false);
                    // }
                    (res).should.have.status(200);
                    (res.body[0]).should.be.a('object');
                    (res.body.length).should.be.eq(1);
                    done();
               // }
            })
            .catch((err) => done(err));
    });

});