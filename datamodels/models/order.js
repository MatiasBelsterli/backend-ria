const OrderStatus = require('../enums/orderStatus');

class Order {
    constructor(id, products, requestDate, totalPrice, requesterId, status = OrderStatus.WAITING, deliveryDate) {
        this.id = id;
        this.products = products; // This will be an array of { productId, quantity }
        this.requestDate = requestDate;
        this.totalPrice = totalPrice;
        this.status = status;
        this.requesterId = requesterId;
        this.bakerId = null;
        this.deliveryDate = deliveryDate
    }
}

module.exports = Order;
