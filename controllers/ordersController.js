const { products } = require('./productsController');
const Orders = require('../datamodels/models/order');
const OrderStatus = require('../datamodels/enums/orderStatus');

let orders = [
    new Orders(1, [{ productId: 1, quantity: 2 }], '2023-05-01', 20.0, OrderStatus.WAITING, 1),
    new Orders(2, [{ productId: 2, quantity: 1 }], '2024-06-01', 20.0, OrderStatus.IN_PROCESS, 2)
];

exports.getOrders = (req, res) => {
    const { status } = req.query;
    let filteredOrders = orders;
    const requestorId = req.userId;

    filteredOrders = orders.filter(order => order.requestorId === requestorId);

    if (status) {
        filteredOrders = orders.filter(order => order.status === status.toUpperCase());
    }

    const ordersWithProducts = filteredOrders.map(order => {
        const completeProducts = order.products.map(p => {
            const product = products.find(prod => prod.id === p.productId);
            return {
                ...product,
                quantity: p.quantity
            };
        });
        return {
            ...order,
            products: completeProducts
        };
    });
    res.json(ordersWithProducts);
};

exports.getOrderById = (req, res) => {
    const { id } = req.params;
    const order = orders.find(o => o.id == id);
    if (order) {
        const completeProducts = order.products.map(p => {
            const product = products.find(prod => prod.id === p.productId);
            return {
                ...product,
                quantity: p.quantity
            };
        });
        res.json({
            ...order,
            products: completeProducts
        });
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

exports.createOrder = (req, res) => {
    const { products } = req.body;
    const newOrderId = orders.length ? orders[orders.length - 1].id + 1 : 1;
    const requestDate = new Date().toISOString();
    const requestorId = req.userId;
    const totalPrice = products.reduce((total, product) => {
        const prod = products.find(p => p.id == product.productId);
        return total + (prod ? prod.price * product.quantity : 0);
    }, 0);
    const newOrder = new Orders(newOrderId, products, requestDate, totalPrice, requestorId);
    orders.push(newOrder);
    res.status(201).json(newOrder);
};

exports.updateOrder = (req, res) => {
    const { id } = req.params;
    const requestorId = req.userId;
    const { products, status } = req.body;
    const orderIndex = orders.findIndex(o => o.id == id);
    if (orderIndex !== -1) {
        const totalPrice = products.reduce((total, product) => {
            const prod = products.find(p => p.id == product.productId);
            return total + (prod ? prod.price * product.quantity : 0);
        }, 0);
        orders[orderIndex] = new Orders(id, products, new Date().toISOString(), totalPrice, status, requestorId);
        res.json(orders[orderIndex]);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

exports.deleteOrder = (req, res) => {
    const { id } = req.params;
    const orderIndex = orders.findIndex(o => o.id == id);
    if (orderIndex !== -1) {
        const deletedOrder = orders.splice(orderIndex, 1);
        res.json(deletedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};
