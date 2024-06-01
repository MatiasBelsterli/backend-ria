const OrderStatus = require('../enums/orderStatus');

class Order {
  constructor(id, products, requestDate, totalPrice, status = OrderStatus.WAITING, requestorId) {
    this.id = id;
    this.products = products; // This will be an array of { productId, quantity }
    this.requestDate = requestDate;
    this.totalPrice = totalPrice;
    this.status = status;
    this.requestorId = requestorId;
  }
}

module.exports = Order;
