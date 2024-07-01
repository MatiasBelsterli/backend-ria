const fs = require('fs');
const path = require('path');
const Product = require('../datamodels/models/product');

const imageToBase64 = (imagePath) => {
  const image = fs.readFileSync(imagePath);
  return image.toString('base64');
};

const imageFolder = path.join(__dirname, '../images');

let products = [
  new Product(1, 'Bread', 'Freshly baked bread', imageToBase64(path.join(imageFolder, 'bread.jpg')), 1.50, [{ supplyId: 1, quantity: 500 }, { supplyId: 6, quantity: 5 }, { supplyId: 7, quantity: 10 }]),
  new Product(2, 'Cake', 'Delicious chocolate cake', imageToBase64(path.join(imageFolder, 'cake.jpg')), 15.00, [{ supplyId: 1, quantity: 200 }, { supplyId: 2, quantity: 150 }, { supplyId: 3, quantity: 200 }, { supplyId: 5, quantity: 2 }]),
  new Product(3, 'Croissant', 'Buttery croissant', imageToBase64(path.join(imageFolder, 'croissant.jpg')), 2.00, [{ supplyId: 1, quantity: 100 }, { supplyId: 3, quantity: 50 }, { supplyId: 5, quantity: 1 }]),
  new Product(4, 'Muffin', 'Blueberry muffin', imageToBase64(path.join(imageFolder, 'muffin.jpg')), 2.50, [{ supplyId: 1, quantity: 150 }, { supplyId: 2, quantity: 50 }, { supplyId: 5, quantity: 1 }, { supplyId: 8, quantity: 5 }]),
  new Product(5, 'Donut', 'Glazed donut', imageToBase64(path.join(imageFolder, 'donut.jpg')), 1.20, [{ supplyId: 1, quantity: 100 }, { supplyId: 2, quantity: 100 }, { supplyId: 3, quantity: 50 }]),
  new Product(6, 'Bagel', 'Sesame bagel', imageToBase64(path.join(imageFolder, 'bagel.jpg')), 1.00, [{ supplyId: 1, quantity: 100 }, { supplyId: 6, quantity: 5 }, { supplyId: 7, quantity: 5 }]),
  new Product(7, 'Cupcake', 'Vanilla cupcake with frosting', imageToBase64(path.join(imageFolder, 'cupcake.jpg')), 3.00, [{ supplyId: 1, quantity: 100 }, { supplyId: 2, quantity: 50 }, { supplyId: 5, quantity: 1 }, { supplyId: 8, quantity: 5 }]),
  new Product(8, 'Pie', 'Apple pie', imageToBase64(path.join(imageFolder, 'pie.jpg')), 12.00, [{ supplyId: 1, quantity: 300 }, { supplyId: 2, quantity: 100 }, { supplyId: 4, quantity: 100 }, { supplyId: 5, quantity: 2 }]),
  new Product(9, 'Brownie', 'Chocolate brownie', imageToBase64(path.join(imageFolder, 'brownie.jpg')), 1.80, [{ supplyId: 1, quantity: 100 }, { supplyId: 2, quantity: 50 }, { supplyId: 3, quantity: 50 }, { supplyId: 5, quantity: 1 }]),
  new Product(10, 'Scone', 'Classic scone', imageToBase64(path.join(imageFolder, 'scone.jpg')), 2.00, [{ supplyId: 1, quantity: 150 }, { supplyId: 3, quantity: 50 }, { supplyId: 5, quantity: 1 }, { supplyId: 8, quantity: 5 }])
];

exports.products = products;

exports.getProducts = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const searchTerm = req.query.searchTerm?.toLowerCase() || '';

  let filteredProducts = products;

  if (searchTerm) filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(searchTerm));

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const resultProducts = filteredProducts.slice(startIndex, endIndex);

  res.json({
    totalItems: products.length,
    totalPages: Math.ceil(products.length / limit),
    currentPage: page,
    products: resultProducts
  });
};

exports.getProductById = (req, res) => {
  const { id } = req.params;
  const product = products.find(p => p.id == id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

exports.createProduct = (req, res) => {
  const { name, description, price, supplies } = req.body;
  const image = req.file;
  if (!image) return res.status(400).json({ message: 'Image not found' });
  const image64 = image.buffer.toString('base64');
  const newProduct = new Product(
      products.length ? products[products.length - 1].id + 1 : 1,
      name,
      description,
      image64,
      price,
      JSON.parse(supplies)
  );
  products.push(newProduct);
  res.status(201).json(newProduct);
};

exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, description, price, supplies } = req.body;
  const image = req.file;
  const productIndex = products.findIndex(p => p.id == id);
  if (productIndex !== -1) {
    if (!image || image === '') {
      products[productIndex] = new Product(Number(id), name, description, products[productIndex].image, price, JSON.parse(supplies));
    } else {
      const image64 = image.buffer.toString('base64');
      products[productIndex] = new Product(Number(id), name, description, image64, price, JSON.parse(supplies));
    }
    res.json(products[productIndex]);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  const productIndex = products.findIndex(p => p.id == id);
  if (productIndex !== -1) {
    const deletedProduct = products.splice(productIndex, 1);
    res.json(deletedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

exports.addIngredientToProduct = (req, res) => {
  const { productId } = req.params;
  const { supplyId, quantity } = req.body;
  const product = products.find(p => p.id == productId);
  const supply = suppliesController.supplies.find(s => s.id == supplyId);

  if (product && supply) {
    product.supplies.push({ supplyId, quantity });
    res.status(201).json(product);
  } else {
    res.status(404).json({ message: 'Product or Supply not found' });
  }
};

exports.updateIngredientInProduct = (req, res) => {
  const { productId, supplyId } = req.params;
  const { quantity } = req.body;
  const product = products.find(p => p.id == productId);

  if (product) {
    const ingredient = product.supplies.find(i => i.supplyId == supplyId);
    if (ingredient) {
      ingredient.quantity = quantity;
      res.json(product);
    } else {
      res.status(404).json({ message: 'Ingredient not found in product' });
    }
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

exports.removeIngredientFromProduct = (req, res) => {
  const { productId, supplyId } = req.params;
  const product = products.find(p => p.id == productId);

  if (product) {
    product.supplies = product.supplies.filter(i => i.supplyId != supplyId);
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};
