const mongoose = require('mongoose')

const docSchema = new mongoose.Schema( {
    code   : Number,
    nombre :  String,
    apellido :  String,
    matricula : Number,
    activo : Boolean
})

const docs = new mongoose.model ('doctores', docSchema)

module.exports = docs