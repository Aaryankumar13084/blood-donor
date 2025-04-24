const mongoose = require('mongoose')

const donor = new  mongoose.Schema({
    name:String,
    district:String,
    bloodgroup:String,
    village: String,
    contact:Number,
    Whatsapp: Number,
})

module.exports = mongoose.model('donors',donor)