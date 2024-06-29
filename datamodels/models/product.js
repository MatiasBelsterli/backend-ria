const ProductSupply = require("./productSupply");

class Product {
    constructor(id, name, description, image, price, supplies = [ ProductSupply ], isDeleted = false) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.image = image;
        this.price = price;
        this.supplies = supplies;
        this.isDeleted = isDeleted;
    }
}

module.exports = Product;