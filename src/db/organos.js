const mongoose = require('mongoose');

const orgSchema = new mongoose.Schema({
  code: { type: Number, required: true, unique: true },
  nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
  mtejido: { type: Boolean, default: false },
  msangre: { type: Boolean, default: false },
  tomo3d: { type: Boolean, default: false },
  medica: { type: Boolean, default: false },
  orden: Number,
  activo: { type: Boolean, default: true },
});

module.exports = mongoose.model('organos', orgSchema);
