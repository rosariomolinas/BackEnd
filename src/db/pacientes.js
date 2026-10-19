const mongoose = require('mongoose');

const pacSchema = new mongoose.Schema({
  code: { type: Number, required: true, unique: true },
  nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
  apellido: { type: String, required: [true, 'El apellido es obligatorio'], trim: true },
  edad: { type: Number, min: [0, 'La edad no puede ser negativa'], max: [130, 'La edad no es válida'] },
  activo: { type: Boolean, default: true },
});

module.exports = mongoose.model('pacientes', pacSchema);
