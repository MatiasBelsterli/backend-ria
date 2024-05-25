let productos = [
    { id: 1, nombre: 'Producto 1', descripcion: 'Descripción 1', imagen: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', precio: 10.0 },
    { id: 2, nombre: 'Producto 2', descripcion: 'Descripción 2', imagen: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', precio: 20.0 }
  ];
  
  exports.getProductos = (req, res) => {
    res.json(productos);
  };
  
  exports.getProductoById = (req, res) => {
    const { id } = req.params;
    const producto = productos.find(p => p.id == id);
    if (producto) {
      res.json(producto);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  };
  
  exports.createProducto = (req, res) => {
    const newProducto = req.body;
    newProducto.id = productos.length ? productos[productos.length - 1].id + 1 : 1;
    productos.push(newProducto);
    res.status(201).json(newProducto);
  };
  
  exports.updateProducto = (req, res) => {
    const { id } = req.params;
    const updatedProducto = req.body;
    const productoIndex = productos.findIndex(p => p.id == id);
    if (productoIndex !== -1) {
      productos[productoIndex] = { ...productos[productoIndex], ...updatedProducto };
      res.json(productos[productoIndex]);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  };
  
  exports.deleteProducto = (req, res) => {
    const { id } = req.params;
    const productoIndex = productos.findIndex(p => p.id == id);
    if (productoIndex !== -1) {
      const deletedProducto = productos.splice(productoIndex, 1);
      res.json(deletedProducto);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  };
  