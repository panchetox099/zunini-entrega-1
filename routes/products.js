const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {
  const productos = JSON.parse(fs.readFileSync(path.resolve('data/productos.json'), 'utf-8'));
  res.json(productos);
});

router.get('/:pid', (req, res) => {
  const productId = req.params.pid;
  const productos = JSON.parse(fs.readFileSync(path.resolve('data/productos.json'), 'utf-8'));
  const producto = productos.find(prod => prod.id === productId);
  if (producto) {
    res.json(producto);
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

router.post('/', (req, res) => {
  const { title, description, price, stock, category, thumbnails } = req.body;
  const newProduct = {
    id: Math.floor(Math.random() * 1000).toString(),
    title,
    description,
    price,
    stock,
    category,
    thumbnails,
    status: true
  };

  let productos = JSON.parse(fs.readFileSync(path.resolve('data/productos.json'), 'utf-8'));
  productos.push(newProduct);
  fs.writeFileSync(path.resolve('data/productos.json'), JSON.stringify(productos, null, 2));

  res.status(201).json(newProduct);
});

router.put('/:pid', (req, res) => {
  const productId = req.params.pid;
  const { title, description, price, stock, category, thumbnails } = req.body;

  let productos = JSON.parse(fs.readFileSync(path.resolve('data/productos.json'), 'utf-8'));
  const index = productos.findIndex(prod => prod.id === productId);

  if (index !== -1) {
    productos[index] = {
      ...productos[index],
      title,
      description,
      price,
      stock,
      category,
      thumbnails
    };

    fs.writeFileSync(path.resolve('data/productos.json'), JSON.stringify(productos, null, 2));

    res.json(productos[index]);
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

router.delete('/:pid', (req, res) => {
  const productId = req.params.pid;

  let productos = JSON.parse(fs.readFileSync(path.resolve('data/productos.json'), 'utf-8'));
  const index = productos.findIndex(prod => prod.id === productId);

  if (index !== -1) {
    productos.splice(index, 1);

    fs.writeFileSync(path.resolve('data/productos.json'), JSON.stringify(productos, null, 2));

    res.send('Producto eliminado correctamente');
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

module.exports = router;
