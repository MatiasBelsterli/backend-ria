const Product = require('../datamodels/models/product');

let products = [
  new Product(1, 'Product 1', 'Description 1', null, 10.0),
  new Product(2, 'Product 2', 'Description 2', null, 20.0)
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
  const { name, description, price } = req.body;
  const image = req.file
  const productIndex = products.findIndex(p => p.id == id);
  if (productIndex !== -1) {
    if (!image || image === '') {
      products[productIndex] = new Product(id, name, description, products[productIndex].image, price);
    } else {
      const image64 = image.buffer.toString('base64');
      products[productIndex] = new Product(id, name, description, image64, price);
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
