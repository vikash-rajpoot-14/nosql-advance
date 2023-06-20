const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback)=>{
  MongoClient.connect("mongodb+srv://aryan:ckJwUJl7MNmkMsbQ@cluster0.nzc7tix.mongodb.net/shop?retryWrites=true&w=majority").then((result) => {
    console.log("connected successfully");
    _db = result.db()
    callback();
  }).catch((err) => {
    console.log(err);
  });
}

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;