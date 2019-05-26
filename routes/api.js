/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var Stock = require('./stock');

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      let like = req.query.like;
      var query = req.query;
      if(req.query.stock instanceof Array){
        req.query.stock = req.query.stock.map((stocki) => stocki.toUpperCase());
        query = { stock: { $in: req.query.stock}}
      } else {
        req.query.stock = req.query.stock.toUpperCase();
      }
      delete req.query.like;
      let ip = req.ip;
      Stock.find(query, (err, data) => {
        if(err || !data || data.length === 0){
          res.send('not found!')
        } else {
          data.forEach((stock)=>{
            if(!stock.ips){
              stock.ips = [];
            }
            if(like && !stock.ips.includes(ip)){
              stock.ips.push(ip);
              stock.likes++;
              stock.save((err, data) => {
              });
              stock.stock = stock.stock.toUpperCase();
            }
          });
          if(data.length === 1){
            res.json({stockData: data[0]});
          } else {
            res.json({stockData: [...data]})
          }
        }
      });
    });

};
