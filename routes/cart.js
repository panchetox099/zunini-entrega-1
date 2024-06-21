const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.post('/', (req, res) => {
  const newCart = {
    id: Math.floor(Math.random() * 1000).toString(),
    products: []
  };

  let carts = JSON.parse(fs.readFileSync(path.resolve('data/carrito.json'), 'utf-8'));
  carts.push(newCart);
  fs.writeFileSync(path.resolve('data/carrito.json'), JSON.stringify(carts, null, 2));

  res.status(201).json(newCart);
});

router.get('/:cid', (req, res) => {
  const cartId = req.params.cid;
  const carts = JSON.parse(fs.readFileSync(path.resolve('data/carrito.json'), 'utf-8'));
  const cart = carts.find(c => c.id === cartId);
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).send('Carrito de compra no encontrado');
  }
});

router.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const { quantity } = req.body;

  let carts = JSON.parse(fs.readFileSync(path.resolve('data/carrito.json'), 'utf-8'));
  const index = carts.findIndex(c => c.id === cartId);

  if (index !== -1) {
    const productIndex = carts[index].products.findIndex(p => p.productId === productId);

    if (productIndex !== -1) {
      carts[index].products[productIndex].quantity += quantity;
    } else {
      carts[index].products.push({ productId, quantity });
    }

    fs.writeFileSync(path.resolve('data/carrito.json'), JSON.stringify(carts, null, 2));
    res.json(carts[index]);
  } else {
    res.status(404).send('Carrito de compra no encontrado');
  }
});

module.exports = router;
