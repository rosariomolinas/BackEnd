const mongoose = require('mongoose');

const docSchema = new mongoose.Schema({
  code: { type: Number, required: true, unique: true },
  nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
  apellido: { type: String, required: [true, 'El apellido es obligatorio'], trim: true },
  matricula: { type: Number, required: [true, 'La matrícula es obligatoria'], min: 1 },
  activo: { type: Boolean, default: true },
});

module.exports = mongoose.model('doctores', docSchema);
