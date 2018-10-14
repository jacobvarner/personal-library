/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

let chaiHttp = require('chai-http');
let chai = require('chai');
let assert = chai.assert;
let server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  
  let id;

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', (done) => {
     chai.request(server)
      .get('/api/books')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', () => {


    suite('POST /api/books with title => create book object/expect book object', () => {
      
      test('Test POST /api/books with title', (done) => {
        chai.request(server)
        .post('/api/books')
        .send({ title: 'Test Title' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'Response should be an Object');
          assert.property(res.body, 'commentcount', 'Book object should contain commentcount');
          assert.property(res.body, 'title', 'Book object should contain title');
          assert.property(res.body, '_id', 'Book object should contain _id');
          id = res.body._id;
          done();
        });
      });
      
      test('Test POST /api/books with no title given', (done) => {
        chai.request(server)
        .post('/api/books')
        .send()
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'Missing title');
          done();
        });
      });
      
    });


    suite('GET /api/books => array of books', () => {
      
      test('Test GET /api/books', (done) => {
        chai.request(server)
        .get('/api/books')
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', () => {
      
      test('Test GET /api/books/[id] with id not in db', (done) =>{
        chai.request(server)
        .get('/api/books/1234')
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'That book does not exist');
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db', (done) =>{
        chai.request(server)
        .get('/api/books/' + id)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body, 'commentcount', 'Book object should contain commentcount');
          assert.property(res.body, 'title', 'Book object should contain title');
          assert.property(res.body, '_id', 'Book object should contain _id');
          done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', () => {
      
      test('Test POST /api/books/[id] with comment', (done) => {
        chai.request(server)
        .post('/api/books/' + id)
        .send({ comment: 'Test comment' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body, 'commentcount', 'Book object should contain commentcount');
          assert.equal(res.body.commentcount, 1);
          done();
        });
      });
      
    });

  });

});
