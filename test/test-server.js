var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server/app');
var should = chai.should();
var server = require('../server/app');  
var Blob = require("../server/models/blob");
chai.use(chaiHttp);





describe('Blobs', function() {
    Blob.collection.drop();
    beforeEach(function(done){
        var newBlob = new Blob({
            name:"Supper",
            lastName:'Man'
        });
        newBlob.save(function(err,data){
            done();
        })
    });
    afterEach(function(done){
        Blob.collection.drop();
        done();
    });
    it('should list ALL blobs on /blobs GET', function(done) {
      chai.request(server)
      .get('/blobs')
      .end(function(err, res){
       res.should.have.status(200);
       res.should.be.json;
       res.body.should.be.a('array');
       res.body[0].should.have.property('_id');
       res.body[0].should.have.property('name');
       res.body[0].should.have.property('lastName');
       res.body[0].name.should.equal('Supper');
       res.body[0].lastName.should.equal('Man');
       done();
   });
  });

it('should list a SINGLE blob on /blob/<id> GET', function(done) {
    var newBlob = new Blob({
      name: 'X',
      lastName: 'Man'
    });
    newBlob.save(function(err, data) {
      chai.request(server)
        .get('/blob/'+data.id)
        .end(function(err, res){
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('_id');
          res.body.should.have.property('name');
          res.body.should.have.property('lastName');
          res.body.name.should.equal('X');
          res.body.lastName.should.equal('Man');
          res.body._id.should.equal(data.id);
          done();
        });
    });
});

    it('should add a SINGLE blob on /blobs POST', function(done) {
      chai.request(server)
      .post('/blobs')
      .send({'name': 'Java', 'lastName': 'Script'})
      .end(function(err, res){
          res.should.have.status(200);
          done();
      });
  });
    it('should update a SINGLE blob on /blob/<id> PUT',function(done){
        chai.request(server)
        .get('/blobs')
        .end(function(err,res){
            chai.request(server)
            .put('/blob/'+res.body[0]._id)
            .send({'name':'Girl'})
            .end(function(error,response){
                 response.should.have.status(200);
                 response.body.UPDATED.name.should.equal('Girl');
                 done();
             });
        })
    });
    it('should delete a SINGLE blob on /blob/<id> DELETE',function(done){
        chai.request(server)
        .get('/blobs')
        .end(function(err,res){
            chai.request(server)
            .delete('/blob/'+res.body[0]._id)
            .end(function(error,response){
                response.should.have.status(200);
                response.body.REMOVED.name.should.equal('Supper');
                done();
            })
        })
    });
});