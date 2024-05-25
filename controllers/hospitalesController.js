let hospitales = [
  { id: 1, nombre: 'Hospital Central', direccion: 'Av. Principal 123' },
  { id: 2, nombre: 'Hospital Norte', direccion: 'Calle Secundaria 456' },
  { id: 3, nombre: 'Hospital Sur', direccion: 'Boulevard Principal 789' }
];

exports.getHospitales = (req, res) => {
  res.json(hospitales);
};

exports.getHospitalById = (req, res) => {
  const { id } = req.params;
  const hospital = hospitales.find(h => h.id == id);
  if (hospital) {
    res.json(hospital);
  } else {
    res.status(404).json({ message: 'Hospital no encontrado' });
  }
};

exports.createHospital = (req, res) => {
  const newHospital = req.body;
  newHospital.id = hospitales.length ? hospitales[hospitales.length - 1].id + 1 : 1;
  hospitales.push(newHospital);
  res.status(201).json(newHospital);
};

exports.updateHospital = (req, res) => {
  const { id } = req.params;
  const updatedHospital = req.body;
  const hospitalIndex = hospitales.findIndex(h => h.id == id);
  if (hospitalIndex !== -1) {
    hospitales[hospitalIndex] = { ...hospitales[hospitalIndex], ...updatedHospital };
    res.json(hospitales[hospitalIndex]);
  } else {
    res.status(404).json({ message: 'Hospital no encontrado' });
  }
};

exports.deleteHospital = (req, res) => {
  const { id } = req.params;
  const hospitalIndex = hospitales.findIndex(h => h.id == id);
  if (hospitalIndex !== -1) {
    const deletedHospital = hospitales.splice(hospitalIndex, 1);
    res.json(deletedHospital);
  } else {
    res.status(404).json({ message: 'Hospital no encontrado' });
  }
};
