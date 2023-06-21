const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email , cart , id ) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }
   static createUser(name , email){
    const db  = getDb();
    return db.collection('users').insertOne({name,email})
   }
   addToCart(product){
   const cartProductIndex = this.cart.items.findIndex((cp)=>{
    return cp.productId.toString() === product._id.toString();
   })

   let newQuantity = 1;
   const updatedCartItems = [...this.cart.items] 
   if(cartProductIndex>=0){
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
   }else{
    updatedCartItems.push({productId : new mongodb.ObjectId( product._id) , quantity : newQuantity})
   }
  const updatedCart = {items: updatedCartItems}
    // const updatedCart = {items: [{productId : product._id, quantity : 1}]}
    const db = getDb();
    return db.collection('users').updateOne({_id : this._id}, {$set : {cart : updatedCart}})
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }
  getCart(){
    const productIds = this.cart.items.map(product => product.productId);
    const db = getDb();
    return db.collection('products').find({_id: { $in : productIds }}).toArray().then((products)=>{
         return products.map(p=>{
          return {
            ...p , quantity : this.cart.items.find(prod=>{
              return prod.productId.toString() === p._id.toString();
            }).quantity
          }
         })
    })
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: new ObjectId(userId) })
      .then(user => {
        // console.log(user);
        return user;
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = User;
