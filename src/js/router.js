'use strict';

App.Router.map(function() {
  this.resource('products', function() {
    this.route('new');
    this.route('product', { path: '/products/:product_id' });
  });

  this.resource('users', function() {
    this.route('new');
    this.route('user', { path: '/users/:user_id' });
  });
});
