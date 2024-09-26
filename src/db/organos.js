const mongoose = require('mongoose')

const orgSchema = new mongoose.Schema( {
    code   : Number,
    nombre :  String,
    mtejido : Boolean,
    msangre : Boolean,
    tomo3d : Boolean,
    medica : Boolean,
    orden : Number
})

const orgs = new mongoose.model ('organos', orgSchema)

module.exports = orgs