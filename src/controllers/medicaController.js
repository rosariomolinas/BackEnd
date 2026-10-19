const medicacion = require('../db/medicacion');

// Devuelve el array de medicamentos (formato que ya consume el frontend).
const traertodos = async (req, res) => {
  const resultado = await medicacion.find({}).sort({ code: 1 });
  res.json(resultado);
};

module.exports = { traertodos };
