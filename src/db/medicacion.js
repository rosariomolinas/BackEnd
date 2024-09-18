const mongoose = require('mongoose')

const medicaSchema = new mongoose.Schema( {
    code   : Number,
    nombre :  String
})

const medica = new mongoose.model ('medicamentos', medicaSchema)

module.exports = medica