const { products: allProducts } = require('./productsController');
const Orders = require('../datamodels/models/order');
const OrderStatus = require('../datamodels/enums/orderStatus');

let orders = [
    new Orders(1, [{ productId: 1, quantity: 2 }], '2023-05-01', 20.0,1 , OrderStatus.WAITING),
    new Orders(2, [{ productId: 2, quantity: 1 }], '2024-06-01', 20.0, 2, OrderStatus.IN_PROCESS)
];

exports.getOrders = (req, res) => {
    const { status } = req.query;
    const requesterId = req.userId;
    const userRole = req.userRole
    let filteredOrders;
    if (userRole === "ADMIN") {
        filteredOrders = orders;
    } else {
        filteredOrders = orders.filter(order => order.requesterId == requesterId);
    }

    if (status) {
        filteredOrders = filteredOrders.filter(order => order.status == status.toUpperCase());
    }

    const ordersWithProducts = filteredOrders.map(order => {
        const completeProducts = order.products.map(p => {
            const product = allProducts.find(prod => prod.id == p.productId);
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
            const product = allProducts.find(prod => prod.id === p.productId);
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

exports.getOrdersToBakers = (req, res) => {
    const ordersToBakers = orders.filter(order => order.status === OrderStatus.WAITING);
    const ordersWithProducts = ordersToBakers.map(order => {
        const completeProducts = order.products.map(p => {
            const product = allProducts.find(prod => prod.id == p.productId);
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
}

exports.takeOrderToBaker = (req, res) => {
    const { id } = req.params;
    const status = req.body.status ?? OrderStatus.IN_PROCESS;
    const bakerId = req.userId;
    const orderIndex = orders.findIndex(o => o.id == id);
    if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        orders[orderIndex].bakerId = bakerId;
        res.json(orders[orderIndex]);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

exports.getOrdersByBaker = (req, res) => {
    const bakerId = req.userId;
    const ordersByBaker = orders.filter(order => order.bakerId === bakerId);
    const ordersWithProducts = ordersByBaker.map(order => {
        const completeProducts = order.products.map(p => {
            const product = allProducts.find(prod => prod.id == p.productId);
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

exports.createOrder = (req, res) => {
    const { products: orderedProducts } = req.body;
    const newOrderId = orders.length ? orders[orders.length - 1].id + 1 : 1;
    const requestDate = new Date().toISOString();
    const totalPrice = orderedProducts.reduce((total, product) => {
        const prod = allProducts.find(p => p.id == product.productId);
        return total + (prod ? prod.price * product.quantity : 0);
    }, 0);
    const requesterId = req.userId; // Make sure this is set correctly

    const newOrder = new Orders(newOrderId, orderedProducts, requestDate, totalPrice, requesterId);
    orders.push(newOrder);
    res.status(201).json(newOrder);
};

exports.updateOrder = (req, res) => {
    const { id } = req.params;
    const requesterId = req.userId;
    const { products: updatedProducts, status } = req.body;
    const orderIndex = orders.findIndex(o => o.id == id);
    if (orderIndex !== -1) {
        const totalPrice = updatedProducts.reduce((total, product) => {
            const prod = allProducts.find(p => p.id == product.productId);
            return total + (prod ? prod.price * product.quantity : 0);
        }, 0);
        orders[orderIndex] = new Orders(id, updatedProducts, new Date().toISOString(), totalPrice, requesterId, status);
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

exports.updateOrderStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const orderIndex = orders.findIndex(o => o.id == id);
    if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        res.json(orders[orderIndex]);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};
