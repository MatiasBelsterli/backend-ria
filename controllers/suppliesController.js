const Supply = require('../datamodels/models/supply');
const { products: allProducts } = require('./productsController');

let supplies = [
    new Supply(1, 'Flour', 'Grams', 0.05),
    new Supply(2, 'Sugar', 'Grams', 0.03),
    new Supply(3, 'Butter', 'Grams', 0.10),
    new Supply(4, 'Milk', 'Ml', 0.02),
    new Supply(5, 'Eggs', 'Units', 0.30),
    new Supply(6, 'Salt', 'Grams', 0.01),
    new Supply(7, 'Yeast', 'Grams', 0.08),
    new Supply(8, 'Baking Powder', 'Grams', 0.04),
];

exports.supplies = supplies;

exports.getSupplies = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchTerm = req.query.searchTerm?.toLowerCase() || '';

    let filteredSupplies = supplies;

    if (searchTerm) filteredSupplies = filteredSupplies.filter(p => p.name.toLowerCase().includes(searchTerm))

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const resultSupplies = filteredSupplies.slice(startIndex, endIndex);

    res.json({
        totalItems: supplies.length,
        totalPages: Math.ceil(supplies.length / limit),
        currentPage: page,
        supplies: resultSupplies
    });
};

exports.getSupplyById = (req, res) => {
    const { id } = req.params;
    const supply = supplies.find(s => s.id == id);
    if (supply) {
        res.json(supply);
    } else {
        res.status(404).json({ message: 'Supply not found' });
    }
};

exports.createSupply = (req, res) => {
    const { name, price, unit } = req.body;
    if (!['Grams', 'Ml'].includes(unit)) {
        return res.status(400).json({ message: 'Invalid unit type' });
    }

    const newSupply = new Supply(
        supplies.length ? supplies[supplies.length - 1].id + 1 : 1,
        name,
        unit,
        price
    );
    supplies.push(newSupply);
    res.status(201).json(newSupply);
};

exports.updateSupply = (req, res) => {
    const { id } = req.params;
    const { name, price, unit } = req.body;
    if (!['Grams', 'Ml'].includes(unit)) {
        return res.status(400).json({ message: 'Invalid unit type' });
    }
    const supplyIndex = supplies.findIndex(s => s.id == id);
    if (supplyIndex !== -1) {
        supplies[supplyIndex] = new Supply(id, name, unit, price);
        res.json(supplies[supplyIndex]);
    } else {
        res.status(404).json({ message: 'Supply not found' });
    }
};

exports.deleteSupply = (req, res) => {
    const { id } = req.params;
    const supplyIndex = supplies.findIndex(s => s.id == id);
    if (supplyIndex !== -1) {
        const hasSupply = allProducts.some(product =>
            product.supplies.some(supply => supply.supplyId == supplies[supplyIndex].id)
        );
        if (hasSupply) {
            res.status(400).json({ message: 'You cannot eliminate an supply if it is being used in a product.' })
            return
        }
        const deletedSupply = supplies.splice(supplyIndex, 1);
        res.json(deletedSupply);
    } else {
        res.status(404).json({ message: 'Supply not found' });
    }
};
