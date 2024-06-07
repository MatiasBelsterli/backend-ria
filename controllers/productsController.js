const Product = require('../datamodels/models/product');

let products = [
  new Product(1, 'Product 1', 'Description 1', null, 10.0),
  new Product(2, 'Product 2', 'Description 2', null, 20.0)
];

exports.products = products;

exports.getProducts = (req, res) => {
  res.json(products);
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
  const { name, description, price } = req.body;
  const image = req.file
  if (!image) return res.status(400).json({ message: 'Image not found' });
  const image64 = image.buffer.toString('base64');
  const newProduct = new Product(
      products.length ? products[products.length - 1].id + 1 : 1,
      name,
      description,
      image64,
      price
  );
  products.push(newProduct);
  res.status(201).json(newProduct);
};

exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, description, image, price } = req.body;
  const productIndex = products.findIndex(p => p.id == id);
  if (productIndex !== -1) {
    products[productIndex] = new Product(id, name, description, image, price);
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
