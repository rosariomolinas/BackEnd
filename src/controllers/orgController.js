const crudController = require('./crudController');
const { organoService } = require('../services');
const costos = require('../config/costos');

// Lista de órganos activos junto con los costos/tiempos configurados (lo usa la carga de intervenciones).
const traertodos = async (req, res) => {
  const lista = await organoService.findAll(true);
  res.json({ lista, valores: costos() });
};

module.exports = { ...crudController(organoService), traertodos };
