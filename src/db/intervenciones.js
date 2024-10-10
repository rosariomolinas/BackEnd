const mongoose = require('mongoose')

const intervenSchema = new mongoose.Schema( {
    paciente : Number,
    doctor   : Number,
    fecint   : Date,
    costo    : Number,
    tiempo   : Number,
    ruta     : {type : Array, "default": []}
})

const intervenciones = new mongoose.model ('intervenciones', intervenSchema)

module.exports = intervenciones