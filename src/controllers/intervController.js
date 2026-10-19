const intervService = require('../services/intervService');
const costos = require('../config/costos');
const { ApiError } = require('../middlewares/errors');

const traertodos = async (req, res) => {
  const lista = await intervService.findAll();
  res.json({ lista, valores: costos() });
};

const traeralgunos = async (req, res) => {
  const data = await intervService.findByFiltro(req.body);
  res.json({ data, message: data.length ? '' : 'No hay intervenciones para ese filtro' });
};

const addnew = async (req, res) => {
  const doc = await intervService.create(req.body);
  res.status(201).json({ data: [doc], message: 'Datos de la intervención guardados' });
};

const findCode = async (req, res) => {
  const doc = await intervService.findById(req.body.id);
  if (!doc) throw new ApiError(404, 'Intervención no encontrada');
  res.json({ data: [doc], message: '' });
};

module.exports = {
  addnew, findCode, traertodos, traeralgunos,
};
