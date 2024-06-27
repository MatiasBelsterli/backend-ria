const { products: allProducts } = require('./productsController');
const Orders = require('../datamodels/models/order');
const OrderStatus = require('../datamodels/enums/orderStatus');

let orders = [
    new Orders(1, [{ productId: 1, quantity: 2 }, { productId: 2, quantity: 3 }], '2024-05-01', 20.0, 3, OrderStatus.WAITING, '2024-05-10'),
    new Orders(2, [{ productId: 1, quantity: 2 }], '2024-05-02', 30.0, 3, OrderStatus.WAITING, '2024-05-12'),
    new Orders(3, [{ productId: 1, quantity: 2 }], '2024-05-03', 50.0, 3, OrderStatus.WAITING, '2024-05-17'),
    new Orders(4, [{ productId: 1, quantity: 2 }], '2024-05-04', 10.0, 3, OrderStatus.WAITING, '2024-05-13'),
    new Orders(5, [{ productId: 1, quantity: 2 }], '2024-05-05', 17.0, 3, OrderStatus.WAITING, '2024-05-15'),
    new Orders(6, [{ productId: 2, quantity: 1 }], '2024-06-01', 33.0, 2, OrderStatus.IN_PROCESS, '2024-06-10')
];

const orderOrders = (orders, sortOrder, sortField) => {
    return orders.sort((a, b) => {
        let valueA, valueB;

        switch (sortField) {
            case 'requestDate':
                valueA = new Date(a.requestDate);
                valueB = new Date(b.requestDate);
                break;
            case 'deliveryDate':
                valueA = new Date(a.deliveryDate);
                valueB = new Date(b.deliveryDate);
                break;
            case 'totalPrice':
                valueA = a.totalPrice;
                valueB = b.totalPrice;
                break;
            default:
                return 0;
        }

        switch (sortOrder) {
            case 'ascRequest':
            case 'ascDelivery':
            case 'ascPrice':
                return valueA - valueB;
            case 'descRequest':
            case 'descDelivery':
            case 'descPrice':
                return valueB - valueA;
            default:
                return 0;
        }
    });
}

const normalizeDate = date => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

exports.getOrders = (req, res) => {
    const requesterId = req.userId;
    const userRole = req.userRole;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const sortRequestDate = req.query.sortRequestDate || '';
    const sortDeliveryDate = req.query.sortDeliveryDate || '';
    const sortPrice = req.query.sortPrice || '';
    const status = req.query.status || '';
    const rangeFrom = req.query.rangeFrom || '';
    const rangeTo = req.query.rangeTo || '';

    let filteredOrders;
    if (userRole === "ADMIN") {
        filteredOrders = orders;
    } else {
        filteredOrders = orders.filter(order => order.requesterId == requesterId);
    }
    if (rangeFrom) {
        const fromDate = normalizeDate(new Date(rangeFrom) - 1);
        if (!rangeTo)
            filteredOrders = filteredOrders.filter(order => normalizeDate(new Date(order.deliveryDate)).getTime() === fromDate.getTime());
        else
            filteredOrders = filteredOrders.filter(order => normalizeDate(new Date(order.deliveryDate)).getTime() >= fromDate.getTime());
    }
    if (rangeTo) {
        const toDate = normalizeDate(new Date(rangeTo) - 1);
        filteredOrders = filteredOrders.filter(order => normalizeDate(new Date(order.deliveryDate)).getTime() <= toDate.getTime());
    }

    if (status) {
        filteredOrders = filteredOrders.filter(order => order.status === status.toUpperCase());
    }

    if (sortRequestDate) {
        filteredOrders = orderOrders(filteredOrders, sortRequestDate, 'requestDate');
    }
    if (sortDeliveryDate) {
        filteredOrders = orderOrders(filteredOrders, sortDeliveryDate, 'deliveryDate');
    }
    if (sortPrice) {
        filteredOrders = orderOrders(filteredOrders, sortPrice, 'totalPrice');
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
    const sortRequestDate = req.query.sortRequestDate || '';
    const sortDeliveryDate = req.query.sortDeliveryDate || '';
    const sortPrice = req.query.sortPrice || '';
    const rangeFrom = req.query.rangeFrom || '';
    const rangeTo = req.query.rangeTo || '';
    let ordersToBakers = orders.filter(order => order.status === OrderStatus.WAITING);
    if (rangeFrom) {
        const fromDate = normalizeDate(new Date(rangeFrom) - 1);
        if (!rangeTo)
            ordersToBakers = ordersToBakers.filter(order => normalizeDate(new Date(order.deliveryDate)).getTime() === fromDate.getTime());
        else
            ordersToBakers = ordersToBakers.filter(order => normalizeDate(new Date(order.deliveryDate)).getTime() >= fromDate.getTime());
    }
    if (rangeTo) {
        const toDate = normalizeDate(new Date(rangeTo) - 1);
        ordersToBakers = ordersToBakers.filter(order => normalizeDate(new Date(order.deliveryDate)).getTime() <= toDate.getTime());
    }
    if (sortRequestDate) {
        ordersToBakers = orderOrders(ordersToBakers, sortRequestDate, 'requestDate');
    }
    if (sortDeliveryDate) {
        ordersToBakers = orderOrders(ordersToBakers, sortDeliveryDate, 'deliveryDate');
    }
    if (sortPrice) {
        ordersToBakers = orderOrders(ordersToBakers, sortPrice, 'totalPrice');
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortRequestDate = req.query.sortRequestDate || '';
    const sortDeliveryDate = req.query.sortDeliveryDate || '';
    const sortPrice = req.query.sortPrice || '';
    const rangeFrom = req.query.rangeFrom || '';
    const rangeTo = req.query.rangeTo || '';
    const status = req.query.status || '';
    let ordersByBaker = orders.filter(order => order.bakerId === bakerId);
    if (rangeFrom) {
        const fromDate = normalizeDate(new Date(rangeFrom) - 1);
        if (!rangeTo)
            ordersByBaker = ordersByBaker.filter(order => normalizeDate(new Date(order.deliveryDate)).getTime() === fromDate.getTime());
        else
            ordersByBaker = ordersByBaker.filter(order => normalizeDate(new Date(order.deliveryDate)).getTime() >= fromDate.getTime());
    }
    if (rangeTo) {
        const toDate = normalizeDate(new Date(rangeTo) - 1);
        ordersByBaker = ordersByBaker.filter(order => normalizeDate(new Date(order.deliveryDate)).getTime() <= toDate.getTime());
    }
    if (status) {
        ordersByBaker = ordersByBaker.filter(order => order.status === status.toUpperCase());
    }
    if (sortRequestDate) {
        ordersByBaker = orderOrders(ordersByBaker, sortRequestDate, 'requestDate');
    }
    if (sortDeliveryDate) {
        ordersByBaker = orderOrders(ordersByBaker, sortDeliveryDate, 'deliveryDate');
    }
    if (sortPrice) {
        ordersByBaker = orderOrders(ordersByBaker, sortPrice, 'totalPrice');
    }
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
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const resultOrders = ordersWithProducts.slice(startIndex, endIndex)
    res.json({
        totalItems: ordersByBaker.length,
        totalPages: Math.ceil(ordersByBaker.length / limit),
        currentPage: page,
        orders: resultOrders
    });
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
