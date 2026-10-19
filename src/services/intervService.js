const intervenciones = require('../db/intervenciones');

const buildFiltro = ({ paciente, doctor, fecdes, fechas }) => {
  const filtro = {};
  if (paciente != null) filtro.paciente = Number(paciente);
  if (doctor != null) filtro.doctor = Number(doctor);
  if (fecdes != null || fechas != null) {
    filtro.fecint = {};
    if (fecdes != null) filtro.fecint.$gte = new Date(fecdes);
    if (fechas != null) filtro.fecint.$lt = new Date(fechas);
  }
  return filtro;
};

module.exports = {
  create: (data) => intervenciones.create({
    paciente: data.paciente,
    doctor: data.doctor,
    fecint: data.fecint,
    costo: data.costo,
    tiempo: data.tiempo,
    ruta: data.ruta,
  }),
  findAll: () => intervenciones.find({}).sort({ fecint: -1 }),
  findByFiltro: (filtros) => intervenciones.find(buildFiltro(filtros)).sort({ fecint: -1 }),
  findById: (id) => intervenciones.findById(id),
};
