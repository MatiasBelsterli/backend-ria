const { products: allProducts } = require('./productsController');
const Orders = require('../datamodels/models/order');
const OrderStatus = require('../datamodels/enums/orderStatus');

let orders = [
    new Orders(1, [{ productId: 1, quantity: 2 }], '2023-05-01', 20.0, 3, OrderStatus.WAITING),
    new Orders(1, [{ productId: 1, quantity: 2 }], '2023-05-02', 30.0, 3, OrderStatus.WAITING),
    new Orders(1, [{ productId: 1, quantity: 2 }], '2023-05-03', 50.0, 3, OrderStatus.WAITING),
    new Orders(1, [{ productId: 1, quantity: 2 }], '2023-05-04', 10.0, 3, OrderStatus.WAITING),
    new Orders(1, [{ productId: 1, quantity: 2 }], '2023-05-05', 17.0, 3, OrderStatus.WAITING),
    new Orders(2, [{ productId: 2, quantity: 1 }], '2024-06-01', 33.0, 2, OrderStatus.IN_PROCESS )
];

const orderOrders = (orders, sortOrder) => {
    return orders.sort((a, b) => {
        const dateRequestA = new Date(a.requestDate);
        const dateRequestB = new Date(b.requestDate);
        const dateDeliveryA = new Date(a.deliveryDate)
        const dateDeliveryB = new Date(b.deliveryDate)

        switch (sortOrder) {
            case 'ascRequest':
                return dateRequestA - dateRequestB;
            case 'descRequest':
                return dateRequestB - dateRequestA;
            case 'ascDelivery':
                return dateDeliveryA - dateDeliveryB;
            case 'descDelivery':
                return dateDeliveryB - dateDeliveryA;
            case 'ascPrice':
                return a.totalPrice - b.totalPrice;
            case 'descPrice':
                return b.totalPrice - a.totalPrice;
            default:
                return 0;
        }
    });
}

exports.getOrders = (req, res) => {
    const { status } = req.query;
    const requesterId = req.userId;
    const userRole = req.userRole
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortOrder = req.query.sortOrder || '';
    let filteredOrders;
    if (userRole === "ADMIN") {
        filteredOrders = orders;
    } else {
        filteredOrders = orders.filter(order => order.requesterId == requesterId);
    }

    if (status) {
        filteredOrders = filteredOrders.filter(order => order.status === status.toUpperCase());
    }

    if (sortOrder) {
        filteredOrders = orderOrders(filteredOrders, sortOrder)
    }

    const ordersWithProducts = filteredOrders.map(order => {
        const completeProducts = order.products.map(p => {
            const product = allProducts.find(prod => prod.id === p.productId);
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

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const resultOrders = ordersWithProducts.slice(startIndex, endIndex)
    res.json({
        totalItems: filteredOrders.length,
        totalPages: Math.ceil(filteredOrders.length / limit),
        currentPage: page,
        orders: resultOrders
    });
};

exports.getOrderById = (req, res) => {
    const { id } = req.params;
    const numericId = Number(id);
    if (isNaN(numericId)) {
        return res.status(400).json({ message: 'Invalid ID, must be a number' });
    }
    const order = orders.find(o => o.id === numericId);
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortOrder = req.query.sortOrder || '';
    let ordersToBakers = orders.filter(order => order.status === OrderStatus.WAITING);
    if (sortOrder) {
        ordersToBakers = orderOrders(ordersToBakers, sortOrder)
    }
    const ordersWithProducts = ordersToBakers.map(order => {
        const completeProducts = order.products.map(p => {
            const product = allProducts.find(prod => prod.id === p.productId);
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
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const resultOrders = ordersWithProducts.slice(startIndex, endIndex)
    res.json({
        totalItems: ordersToBakers.length,
        totalPages: Math.ceil(ordersToBakers.length / limit),
        currentPage: page,
        orders: resultOrders
    });
}

exports.takeOrderToBaker = (req, res) => {
    const { id } = req.params;
    const status = req.body.status ?? OrderStatus.IN_PROCESS;
    const bakerId = req.userId;
    const numericId = Number(id);
    if (isNaN(numericId)) {
        return res.status(400).json({ message: 'Invalid ID, must be a number' });
    }
    const orderIndex = orders.findIndex(o => o.id === numericId);
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
            const product = allProducts.find(prod => prod.id === p.productId);
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
    const { products: orderedProducts, deliveryDate } = req.body;
    const newOrderId = orders.length ? orders[orders.length - 1].id + 1 : 1;
    const requestDate = new Date().toISOString()
    const totalPrice = orderedProducts.reduce((total, product) => {
        const prod = allProducts.find(p => p.id === product.productId);
        return total + (prod ? prod.price * product.quantity : 0);
    }, 0);
    const requesterId = req.userId; // Make sure this is set correctly

    const newOrder = new Orders(newOrderId, orderedProducts, requestDate, totalPrice, requesterId, OrderStatus.WAITING, deliveryDate);
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
    const numericId = Number(id);
    if (isNaN(numericId)) {
        return res.status(400).json({ message: 'Invalid ID, must be a number' });
    }
    const orderIndex = orders.findIndex(o => o.id === numericId);
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
    const numericId = Number(id);
    if (isNaN(numericId)) {
        return res.status(400).json({ message: 'Invalid ID, must be a number' });
    }
    const orderIndex = orders.findIndex(o => o.id === numericId);
    if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        res.json(orders[orderIndex]);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};
