const mongoose =  require('mongoose');
const MONGODB_CONNECTION_STRING = process.env.CONNECTION_STRING ? process.env.CONNECTION_STRING : 'mongodb://localhost:27017/fcc';
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
mongoose.connect(MONGODB_CONNECTION_STRING);
const Schema = mongoose.Schema;
const StockSchema = new Schema({
  stock: String,
  price: Number,
  likes: { type: Number, get: v => Math.round(v), set: v => Math.round(v)},
  like: Boolean,
  ips: Array
})
const Stock = mongoose.model('Stock', StockSchema);

module.exports = Stock;
