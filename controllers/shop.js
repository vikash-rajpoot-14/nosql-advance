const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findAll({ where: { id: prodId } })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
   req.user.getCart().then(products => {
    // console.log("products", products);
   res.render('shop/cart', {
   path: '/cart',
   pageTitle: 'Your Cart',
   products: products
   });
   })
   .catch(err =>{console.log(err)
    });
  
  }

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId).then(product => {
     req.user.addToCart(product)
     res.redirect('/cart')
  }).then((cart) => {
    // console.log("cart",cart);
  }).catch((err) => {
    console.log(err);
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.deleteCartProduct(prodId).then(product => {
  return res.redirect('/cart')
  }).catch((err) => {console.log(err);});
};

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then(order => {
      console.log(order);
      res.redirect('/orders');
    }).catch((err) => {console.log})
  }


exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then(orders => {
      console.log("orders",orders);
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};
