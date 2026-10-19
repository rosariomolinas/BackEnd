const mongoose = require('mongoose');

// paciente, doctor y ruta[].organo guardan el "code" de cada entidad.
const intervenSchema = new mongoose.Schema({
  paciente: { type: Number, required: [true, 'El paciente es obligatorio'] },
  doctor: { type: Number, required: [true, 'El doctor es obligatorio'] },
  fecint: { type: Date, required: [true, 'La fecha es obligatoria'] },
  costo: { type: Number, min: 0 },
  tiempo: { type: Number, min: 0 },
  ruta: { type: Array, default: [] },
});

module.exports = mongoose.model('intervenciones', intervenSchema);
