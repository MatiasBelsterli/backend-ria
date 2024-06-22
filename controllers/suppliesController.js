const Supply = require('../datamodels/models/supply');

let supplies = [
    new Supply(1, 'Flour', 'grams', 0.05),
    new Supply(2, 'Sugar', 'grams', 0.03)
];

exports.supplies = supplies;

exports.getSupplies = (req, res) => {
    res.json(supplies);
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
    const { name, unit, price } = req.body;
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
    const { name, unit, price } = req.body;
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
        const deletedSupply = supplies.splice(supplyIndex, 1);
        res.json(deletedSupply);
    } else {
        res.status(404).json({ message: 'Supply not found' });
    }
};
