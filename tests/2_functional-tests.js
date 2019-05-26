/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

/*

Before running these tests, make sure to have:

1) A stocks collection in the fcc database
2) 2 stock documents:

{"_id":{"$oid":"5ce9b2201c9d440000b7ef05"},"stock":"GOOG","price":"786.90","likes":{"$numberInt":"4"}}
{"_id":{"$oid":"5cea577a1c9d440000b7ef07"},"stock":"MSFT","price":"62.30","likes":{"$numberInt":"6"}}

*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var Stock = require('../routes/stock');
chai.use(chaiHttp);

var testLike;

suite('Functional Tests', function() {

    Stock.deleteMany({}, ()=>{});
    new Stock({
      "stock" : "GOOG",
      "price" : "786.90",
      "likes" : 0
    }).save();

    new Stock({
      "stock" : "MSFT",
      "price" : "62.30",
      "likes" : 0
    }).save();

    suite('GET /api/stock-prices => stockData object', function() {

      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
          assert.equal(res.body.stockData.stock, 'GOOG');
          assert.approximately(res.body.stockData.price, 786.9, 0.1);
          done();
        });
      });

      test('1 stock with like', function(done) {
        chai.request(server)
         .get('/api/stock-prices')
         .query({stock: 'goog', like: true})
         .end(function(err, res){
           assert.equal(res.body.stockData.stock, 'GOOG');
           assert.approximately(res.body.stockData.price, 786.9, 0.1);
           assert.equal(res.body.stockData.likes, 1);
           done();
         });
      });

      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
         .get('/api/stock-prices')
         .query({stock: 'goog', like: true})
         .end(function(err, res){
           assert.equal(res.body.stockData.stock, 'GOOG');
           assert.approximately(res.body.stockData.price, 786.9, 0.1);
           assert.equal(res.body.stockData.likes, 1);
           done();
         });
      });

      test('2 stocks', function(done) {
        chai.request(server)
         .get('/api/stock-prices')
         .query({stock: ['goog', 'msft']})
         .end(function(err, res){
           assert.equal(res.body.stockData[0].stock, 'GOOG');
           assert.approximately(res.body.stockData[0].price, 786.9, 0.1);
           assert.equal(res.body.stockData[0].likes, 1);
           assert.equal(res.body.stockData[1].stock, 'MSFT');
           assert.approximately(res.body.stockData[1].price, 62.3, 0.1);
           assert.equal(res.body.stockData[1].likes, 0);
           done();
         });
      });

      test('2 stocks with like', function(done) {
        chai.request(server)
         .get('/api/stock-prices')
         .query({stock: ['goog', 'msft'], like: true})
         .end(function(err, res){
           assert.equal(res.body.stockData[0].stock, 'GOOG');
           assert.approximately(res.body.stockData[0].price, 786.9, 0.1);
           assert.equal(res.body.stockData[0].likes, 1);
           assert.equal(res.body.stockData[0].rel_likes, 0);
           assert.equal(res.body.stockData[1].stock, 'MSFT');
           assert.approximately(res.body.stockData[1].price, 62.3, 0.1);
           assert.equal(res.body.stockData[1].likes, 1);
           assert.equal(res.body.stockData[1].rel_likes, 0);
           done();
         });
      });

    });

});
