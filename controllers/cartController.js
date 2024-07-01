const { products: allProducts } = require('./productsController');

let carts = {};

exports.getCart = (req, res) => {
    const userId = req.userId;
    const cart = carts[userId] || [];
    const cartWithProducts = cart.map(item => {
        const product = allProducts.find(p => p.id == item.productId);
        return {
            ...product,
            quantity: item.quantity
        };
    });
    res.json(cartWithProducts);
};

exports.addProduct = (req, res) => {
    const userId = req.userId;
    const { productId, quantity } = req.body;
    if (!carts[userId]) {
        carts[userId] = [];
    }
    const cart = carts[userId];
    const existingProduct = cart.find(item => item.productId == productId);

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({ productId, quantity });
    }
    res.status(201).json(cart);
};

exports.updateProductQuantity = (req, res) => {
    const userId = req.userId;
    const { productId } = req.params;
    const { quantity } = req.body;
    const cart = carts[userId] || [];
    const existingProduct = cart.find(item => item.productId == productId);

    if (existingProduct) {
        if (quantity <= 0) {
            carts[userId] = carts[userId].filter(item => item.productId != productId);
        } else {
            existingProduct.quantity = quantity;
        }
        res.json(existingProduct);
    } else {
        res.status(404).json({ message: 'Product not found in cart' });
    }
};

exports.removeProduct = (req, res) => {
    const userId = req.userId;
    const { productId } = req.params;
    if (carts[userId]) {
        carts[userId] = carts[userId].filter(item => item.productId != productId);
        res.json(carts[userId]);
    } else {
        res.status(404).json({ message: 'Cart not found' });
    }
};

exports.clearCart = (req, res) => {
    const userId = req.userId;
    carts[userId] = [];
    res.json({ message: 'Cart cleared' });
};
