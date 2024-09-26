const mongoose = require('mongoose')

const usuSchema = new mongoose.Schema( {
    user     :  String,
    password :  String,
    profile  :  String
})

const usuarios = new mongoose.model ('usuarios', usuSchema)

module.exports = usuarios