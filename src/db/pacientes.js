const mongoose = require('mongoose')

const pacSchema = new mongoose.Schema( {
    code : Number,
    nombre :  String,
    apellido :  String,
    edad :  Number,
    activo : Boolean
})

const pacientes = new mongoose.model ('pacientes', pacSchema)

module.exports = pacientes