const mongoose = require('mongoose')

const history = mongoose.Schema({
    name:String,
    tehsil:String,
    bloodgroup:String,
    village: String,
    contact:Number,
    Whatsapp: Number,
    password: String,
})

module.exports = mongoose.model('history',history)