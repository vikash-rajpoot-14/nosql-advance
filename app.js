const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('6492a65c4a8ffc0ee4f8f8b2')
    .then(user => {
      // console.log("user" , user);
      req.user = new User(user.name , user.email , user.cart , user._id);
      // console.log("user" , req.user.cart);
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000);
  // User.createUser('John', "john@example.com")
  // .then(user => {console.log(user);})
  // .catch(err => console.log(err));
});
